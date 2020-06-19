import { ServerMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';
import { or, getNodeEnv } from '@arks/utils';
import { 
    ArksWebpackCompiler,
    createArksWebpackCompiler,
    runArksWebpackCompiler,
    createArksWebpackDevMiddleware,
    createArksWebpackHotMiddleare,
} from '@arks/compiler';
import { 
    reactAppClientEntryFactoryTemplate,
    reactAppClientRootTemplateFactory,
} from '@arks/client/templates';
import { ArksReactServerRenderer } from '@arks/client/arks-server-renderer';

import * as path from 'path';
import * as fs from 'fs';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limit from 'express-rate-limit';
import * as bodyParser from 'body-parser';
import coolieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import ora from 'ora';

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
    compiledClientBundleFilename: string;
    compiledAppComponentFilename: string;
    reactAppClientEntryFilePath: string;
    reactAppClientRootFilePath: string;
    reactAppRootNodeId: string;
    internalGraphQLEndpoint: string;

    localUrlForTerminal: string;
}

export class ArksServer {
    private options: ArksServerOptions;
    private _isDev: boolean;
    private _cwd: string;

    private app: express.Express;
    private metricsController: MetricsController | null = null;
    private livenessController: LivenessController | null = null;
    private graphqlController: GraphQLController | null = null;

    private readonly _webpackDevMiddlewareBuildDirectory: string = `__webpack_dev_build`;

    private serverArksWebpackCompiler: ArksWebpackCompiler | null = null;
    private isFirstBuild: boolean = true;

    constructor(options: ArksServerOptions, isDev: boolean, cwd: string) {
        this.options = options;

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
        const {
            internalGraphQLEndpoint, 
            graphqlApiEndpoint 
        } = this.options;

        ArksServerLogger.info(ServerMessage.creatingGraphQLController);
        this.graphqlController = new GraphQLController(internalGraphQLEndpoint, graphqlApiEndpoint);
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

    private async runServerArksWebpackCompiler(): Promise<void> {
        const spinner = ora({ 
            text: `${ServerMessage.compilingReactAppForServerSideRendering}`, 
            color: 'cyan',
            spinner: 'dots',
            stream: process.stdout,
        });

        try {
            if (this.serverArksWebpackCompiler !== null) {
                spinner.start();

                const compilerResult = await runArksWebpackCompiler(this.serverArksWebpackCompiler);

                spinner.stop();
                ArksServerLogger.info(ServerMessage.reactAppCompilationForServerSideRenderingSuccess);
                ArksServerLogger.emptyLine();

                ArksServerLogger.logRaw(compilerResult.toString({ colors: true, chunks: true }), true);
            }
        }
        catch (err) {
            spinner.stop();
            ArksServerLogger.info(ServerMessage.reactAppCompilationForServerSideRenderingError);
            ArksServerLogger.error(err.message || err, err.stack);
        }
    }

    private async compilesFromAppRootForSSR(): Promise<void> {
        const {
            sourceDirectoryPath,
            appComponentFilename,
            compiledAppComponentFilename,
            compiledServerSourceDirectoryPath,
        } = this.options;

        try {
            ArksServerLogger.info(ServerMessage.creatingServerArksWebpackCompiler);
            this.serverArksWebpackCompiler = createArksWebpackCompiler({
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
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();

        await this.runServerArksWebpackCompiler();

        ArksServerLogger.emptyLine();
    }

    private async compilesFromAppRootForCSR(onCSRComlilationEnd?: (isFirstBuild: boolean) => void): Promise<void> {
        const { 
            reactAppClientEntryFilePath,
            reactAppClientRootFilePath,
            reactAppRootNodeId,
            sourceDirectoryPath,
            compiledClientBundleFilename,
            localUrlForTerminal,
        } = this.options;

        try {
            ArksServerLogger.info(ServerMessage.lookingForReactAppClientEntry);

            const isReactAppClientEntryExists = fs.existsSync(path.resolve(this._cwd, `./${reactAppClientEntryFilePath}`));
            if (isReactAppClientEntryExists) {
                ArksServerLogger.info(ServerMessage.reactAppClientEntryFound);
            }
            else {
                ArksServerLogger.info(ServerMessage.noReactAppClientEntryFound);
                ArksServerLogger.info(ServerMessage.creatingReactAppClientEntry);

                if (!fs.existsSync(path.resolve(this._cwd, './.arks/client'))) {
                    await fs.promises.mkdir(path.resolve(this._cwd, './.arks/client'));
                }

                await fs.promises.writeFile(
                    path.resolve(this._cwd, `./${reactAppClientEntryFilePath}`),
                    reactAppClientEntryFactoryTemplate(reactAppRootNodeId),
                    {
                        encoding: 'utf-8'
                    }
                );
                
                ArksServerLogger.info(ServerMessage.reactAppClientEntryCreationSuccess);
            }
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.reactAppClientEntryCreationError)
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();

        try {
            ArksServerLogger.info(ServerMessage.lookingForReactAppClientRoot);

            const isReactAppClientRootExists = fs.existsSync(path.resolve(this._cwd, `./${reactAppClientRootFilePath}`));
            if (isReactAppClientRootExists) {
                ArksServerLogger.info(ServerMessage.reactAppClientRootFound);
            }
            else {
                ArksServerLogger.info(ServerMessage.noReactAppClientRootFound);
                ArksServerLogger.info(ServerMessage.creatingReactAppClientRoot);

                await fs.promises.writeFile(
                    path.resolve(this._cwd, `./${reactAppClientRootFilePath}`),
                    reactAppClientRootTemplateFactory('/graphql'),
                    {
                        encoding: 'utf-8'
                    }
                );

                ArksServerLogger.info(ServerMessage.reactAppClientRootCreationSuccess);
            }
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.reactAppClientRootCreationError)
            ArksServerLogger.error(err.message || err, err.stack);
        }

        const publicPath: string = `${localUrlForTerminal}${this._webpackDevMiddlewareBuildDirectory}`;
        const hmrPath: string = `/__webpack_hmr`;
        const hmrHearbeat: number = 2000;

        let compiler: ArksWebpackCompiler | null = null;

        try {
            ArksServerLogger.info(ServerMessage.creatingClientArksWebpackCompiler);

            compiler = createArksWebpackCompiler({
                srcDirectoryPath: [
                    path.resolve(this._cwd, `./.arks/client`),
                    path.resolve(this._cwd, `./${sourceDirectoryPath}`)
                ],
                entryPointPath: path.resolve(this._cwd, `./${reactAppClientEntryFilePath}`),
                hmrPath: `${localUrlForTerminal}__webpack_hmr`,
                hmrHearbeat,
                publicPath,
                filename: compiledClientBundleFilename,
                tsconfigPath: path.resolve(this._cwd, './tsconfig.json'),
                useSourceMap: this._isDev,
                profiling: !this._isDev,
            });

            compiler.hooks.done.tap('ArksClientWebpackComplierDonePlugin', async (): Promise<void> => {
                if (!!onCSRComlilationEnd) {
                    onCSRComlilationEnd(this.isFirstBuild);
                }

                if (!this.isFirstBuild) {
                    await this.runServerArksWebpackCompiler();
                }
                else {
                    this.isFirstBuild = false;
                }
            });
            
            ArksServerLogger.info(ServerMessage.clientArksWebpackCompilerCreated);
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.arksClientWebpackCompilerCreationError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();

        if (compiler !== null) {
            // @ts-ignore
            this.app.use(createArksWebpackDevMiddleware(compiler, {
                publicPath,
                stats: { 
                    colors: true,
                    chunks: true,
                },
                lazy: false,
                serverSideRender: false,
                headers: { 'Access-Control-Allow-Origin': 'same-origin' },
            }));

            this.app.use(createArksWebpackHotMiddleare(compiler, {
                path: hmrPath,
                heartbeat: hmrHearbeat,
            }));
        }
    }

    async setExpressApp(onCSRComlilationEnd?: (isFirstBuild: boolean) => void): Promise<void> {
        const { 
            appName,
            compiledAppComponentFilename,
            compiledServerSourceDirectoryPath,
            reactAppRootNodeId,
            compiledClientBundleFilename,
            localUrlForTerminal,
            internalGraphQLEndpoint,
        } = this.options;

        this.addMiddlewares();
        this.addStaticDirectories();
        this.addControllers();

        if (this._isDev) {
            await this.compilesFromAppRootForSSR();
            await this.compilesFromAppRootForCSR(onCSRComlilationEnd);
        }

        this.app.use('*', async (req: express.Request, res: express.Response): Promise<void> => {
            try {
                const markups: string = await ArksReactServerRenderer({
                    title: appName,
                    build: this._isDev ? 
                        `${localUrlForTerminal}${this._webpackDevMiddlewareBuildDirectory}/${compiledClientBundleFilename}` : 
                        `/build/${compiledClientBundleFilename}`,
                    publicPath: '/public',
                    reactAppRootNodeId,
                    internalGraphQLEndpoint,
                    url: req.url,
                    cwd: this._cwd,
                    compiledServerSourceDirectoryPath: `${compiledServerSourceDirectoryPath}`,
                    compiledAppComponentFilename,
                });

                res.status(200).send(`<!doctype html>\n${markups}`).end();
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