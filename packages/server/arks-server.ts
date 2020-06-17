import { ServerMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';
import { or, getNodeEnv } from '@arks/utils';
import { 
    ArksWebpackCompiler,
    createArksWebpackCompiler,
    runArksWebpackCompiler,
} from '@arks/compiler';
import { ArksReactServerRenderer } from '@arks/client';

import * as path from 'path';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limit from 'express-rate-limit';
import * as bodyParser from 'body-parser';
import coolieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { 
    MetricsController,
    LivenessController,
    GraphQLController,
} from './controllers';

export interface ArksServerOptions {
    appName: string;

    noMetrics: boolean;
    noLiveness: boolean;
    metricsEndpoint: string;
    livenessEndpoint: string;

    noHelmet: boolean;
    noCors: boolean;
    noLimit: boolean;
    noBodyParser: boolean;
    noCookieParser: boolean;
    noCompression: boolean;

    noLogger: boolean;

    publicDirectoryPath: string;

    port: number;
    host: string;
    protocol: string;

    graphqlApiEndpoint: string;

    metricsCollectTimeout: number;
    httpTimeout: number;
    limitWindowsTimeFrameMs: number;
    limitMaxRequestsPerIp: number;

    sourceDirectoryPath: string;
    appComponentFilename: string;
    compiledClientSourceDirectoryPath: string;
    compiledServerSourceDirectoryPath: string;
    compiledAppComponentFilename: string;
    reactAppRootNodeId: string;
}

export class ArksServer {
    private options: ArksServerOptions;
    private _isDev: boolean;
    private _cwd: string;

    private app: express.Express;
    private metricsController: MetricsController | null;
    private livenessController: LivenessController | null;
    private graphqlController: GraphQLController | null;

    constructor(options: ArksServerOptions, isDev: boolean, cwd: string) {
        this.options = options;

        this.metricsController = null;
        this.livenessController = null;
        this.graphqlController = null;

        this._isDev = isDev;
        this._cwd = cwd;

        this.setMetricsController();
        this.setLivenessController();
        this.setGraphQLController();

        this.app = express();
    }

    private setMetricsController(): void {
        const { 
            noMetrics, 
            metricsEndpoint,
            metricsCollectTimeout,
        } = this.options;

        or(!noMetrics, () => {
            ArksServerLogger.info(ServerMessage.creatingMetricsController);
            
            this.metricsController = new MetricsController(
                metricsEndpoint,
                metricsCollectTimeout
            );

            ArksServerLogger.info(ServerMessage.metricsControllerCreated);
        }, () => {
            ArksServerLogger.info(ServerMessage.noMetrics);
        });

        ArksServerLogger.emptyLine();
    }

    private setLivenessController(): void {
        const {
            noLiveness,
            livenessEndpoint,
        } = this.options;

        or(!noLiveness, () => {
            ArksServerLogger.info(ServerMessage.creatingLivenessController);
            this.livenessController = new LivenessController(livenessEndpoint);
            ArksServerLogger.info(ServerMessage.livenessControllerCreated);
        }, () => {
            ArksServerLogger.info(ServerMessage.noLiveness);
        });

        ArksServerLogger.emptyLine();
    }

    private setGraphQLController(): void {
        const { graphqlApiEndpoint } = this.options;

        ArksServerLogger.info(ServerMessage.creatingGraphQLController);
        this.graphqlController = new GraphQLController('/graphql', graphqlApiEndpoint);
        ArksServerLogger.info(ServerMessage.graphQlControllerCreated);
        ArksServerLogger.emptyLine();
    }

    private addMiddlewares(): void {
        const nodeEnv = getNodeEnv();
        const {
            noHelmet,
            noCors,
            noLimit,
            noBodyParser,
            noCookieParser,
            noCompression,
            metricsEndpoint,
            livenessEndpoint,

            limitWindowsTimeFrameMs,
            limitMaxRequestsPerIp,
        } = this.options;

        or(noHelmet, () => {
            ArksServerLogger.info(ServerMessage.noHelmet);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(helmet());
        });

        or(noCors, () => {
            ArksServerLogger.info(ServerMessage.noCors);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(cors({
                credentials: true,
                allowedHeaders: ['Content-Type', 'Accept'],
            }));
        });

        or(noLimit, () => {
            ArksServerLogger.info(ServerMessage.noCors);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(limit({
                windowMs: limitWindowsTimeFrameMs,
                max: limitMaxRequestsPerIp,
                skip: (req: express.Request): boolean => {
                    return ![metricsEndpoint, livenessEndpoint].includes(req.path);
                }
            }));
        });

        or(noBodyParser, () => {
            ArksServerLogger.info(ServerMessage.noBodyParser);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(bodyParser.json());
        });

        or(noCookieParser, () => {
            ArksServerLogger.info(ServerMessage.noCookieParser);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(coolieParser());
        });

        or(noCompression, () => {
            ArksServerLogger.info(ServerMessage.noCompression);
            ArksServerLogger.emptyLine();
        }, () => {
            this.app.use(compression());
        });

         // @ts-ignore
         this.app.use(morgan((tokens: morgan.TokenIndexer, req: express.Request, res: express.Response): string => {
            return ArksServerLogger.infoToString(`${tokens.method(req, res)} ${tokens.status(req, res)} ${tokens.url(req, res)} ${tokens['response-time'](req, res)}ms as ${nodeEnv}!`);
        }));
    }

    private addStaticDirectories(): void {
        const {
            publicDirectoryPath,
            compiledClientSourceDirectoryPath,
        } = this.options;

        ArksServerLogger.info(ServerMessage.settingPublicDirectory);
        this.app.use('/public', express.static(path.resolve(this._cwd, `./${publicDirectoryPath}`)));
        ArksServerLogger.info(`${ServerMessage.publicDirectorySetted} ${this._cwd}/${publicDirectoryPath}`);
        ArksServerLogger.emptyLine();

        if (!this._isDev) {
            ArksServerLogger.info(ServerMessage.settingBuildDirectory);
            this.app.use('/build', express.static(path.resolve(this._cwd, `./${compiledClientSourceDirectoryPath}`)));
            ArksServerLogger.info(`${ServerMessage.buildDirectorySetted} ${this._cwd}/${compiledClientSourceDirectoryPath}`);
            ArksServerLogger.emptyLine();
        }
    }

    private addControllers(): void {
        const {
            noMetrics,
            noLiveness,
        } = this.options;

        if (!noMetrics && this.metricsController !== null) {
            this.app.use(this.metricsController.router);

            ArksServerLogger.info(ServerMessage.metricsControllerAdded);
            ArksServerLogger.emptyLine();
        }

        if (!noLiveness && this.livenessController !== null) {
            this.app.use(this.livenessController.router);

            ArksServerLogger.info(ServerMessage.livenessControllerAdded);
            ArksServerLogger.emptyLine();
        }

        if (this.graphqlController !== null) {
            this.app.use(this.graphqlController.router);

            ArksServerLogger.info(ServerMessage.graphQlControllerAdded);
            ArksServerLogger.emptyLine();
        }
    }

    private async compilesFromAppRootForSSR(): Promise<void> {
        const {
            sourceDirectoryPath,
            appComponentFilename,
            compiledAppComponentFilename,
            compiledServerSourceDirectoryPath,
        } = this.options;

        let compiler: ArksWebpackCompiler | null = null
        try {
            ArksServerLogger.info(ServerMessage.creatingServerArksWebpackCompiler);
            compiler = createArksWebpackCompiler({
                srcDirectoryPath:  path.resolve(this._cwd, `./${sourceDirectoryPath}`),
                entryPointPath: path.resolve(this._cwd, `./${sourceDirectoryPath}/${appComponentFilename}`),
                outputPath: path.resolve(this._cwd, `./${compiledServerSourceDirectoryPath}`),
                filename: compiledAppComponentFilename,
                tsconfigPath: path.resolve(this._cwd, './tsconfig.json'),
                noHmr: true,
                useUmdLibrary: true,
                useSourceMap: this._isDev,
                profiling: !this._isDev,
            });
            ArksServerLogger.info(ServerMessage.serverArksWebpackCompilerCreated);
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.arksServerWebpackCompilerCreationError);
            ArksServerLogger.error(err.message || '', err.stack);
        }

        ArksServerLogger.emptyLine();

        try {
            if (compiler !== null) {
                ArksServerLogger.info(ServerMessage.compilingReactAppForServerSideRendering);
                const compilerResult = await runArksWebpackCompiler(compiler);

                ArksServerLogger.info(ServerMessage.reactAppCompilationForServerSideRenderingSuccess);
                ArksServerLogger.emptyLine();

                ArksServerLogger.logRaw(compilerResult.toString({ colors: true, chunks: true }), true);
            }
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.reactAppCompilationForServerSideRenderingError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();
    }

    async setExpressApp(): Promise<void> {
        const { 
            appName,
            compiledAppComponentFilename,
            compiledServerSourceDirectoryPath,
            reactAppRootNodeId,
        } = this.options;

        this.addMiddlewares();
        this.addStaticDirectories();
        this.addControllers();

        await this.compilesFromAppRootForSSR();

        this.app.use('*', async (req: express.Request, res: express.Response): Promise<void> => {
            try {
                const markups: string = await ArksReactServerRenderer({
                    title: appName,
                    build: '',
                    publicPath: '/public',
                    reactAppRootNodeId,
                    url: req.url,
                    cwd: this._cwd,
                    compiledServerSourceDirectoryPath: `${compiledServerSourceDirectoryPath}`,
                    compiledAppComponentFilename,
                });

                res.status(200).send(`<!doctype html>\n${markups}`);
            }
            catch (err) {
                ArksServerLogger.error(err.message || '', err.stack);
                res.status(500).end();
            } 
        });
    }

    getExpressApp(): express.Express {
        return this.app;
    }
}