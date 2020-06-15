import { ServerMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';
import { or, getNodeEnv } from '@arks/utils';

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
} from './controllers';

export interface ArksServerOptions {
    appName?: string;

    noMetrics?: boolean;
    noLiveness?: boolean;
    metricsEndpoint?: string;
    livenessEndpoint?: string;

    noHelmet?: boolean;
    noCors?: boolean;
    noLimit?: boolean;
    noBodyParser?: boolean;
    noCookieParser?: boolean;
    noCompression?: boolean;

    noLogger?: boolean;

    publicDirectoryPath?: string;
    buildDirectoryPath?: string;

    port?: number;
    host?: string;
    protocol?: string;

    graphqlApiEndpoint?: string;

    metricsCollectTimeout?: number;
    httpTimeout?: number;
    limitWindowsTimeFrameMs?: number;
    limitMaxRequestsPerIp?: number;
}

export class ArksServer {
    private options: Required<ArksServerOptions>;

    private app: express.Express;
    private metricsController: MetricsController | null;
    private livenessController: LivenessController | null;

    constructor(options: Required<ArksServerOptions>, isDev: boolean) {
        this.options = options;

        this.app = express();
        this.metricsController = null;
        this.livenessController = null;

        this.setMetricsController();
        this.setLivenessController();
        this.setExpressApp();
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

    private setExpressApp(): void {
        const nodeEnv = getNodeEnv();
        const { 
            noHelmet,
            noCors,
            noLimit,
            noBodyParser,
            noCookieParser,
            noCompression,
            noMetrics,
            noLiveness,

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

        this.app.use('*', (req: express.Request, res: express.Response): void => {
            res.status(200).send('Hello There !');
        });
    }

    getExpressApp(): express.Express {
        return this.app;
    }
}