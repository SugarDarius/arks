
import { ArksServerLogger } from '@arks/logger';
import { ServerMessage, ProcessMessage } from '@arks/common';
import {
    normalizePort,
    prepareUrls,
    or,
    isNil,
    isString,
    isNumber,
    isBoolean,
} from '@arks/utils';

import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as http from 'http';

import open from 'open';

import * as arksDefaultConfig from './configs';
import { createArksServer } from './create-arks-server';

export type StartArksServerOptions = {
    port?: string;
    host?: string;
    protocol?: string;
};

export async function startArksServer(isDev: boolean, options: StartArksServerOptions) {
    const cwd: string = process.cwd();

    if (!!process.env.NODE_ENV) {
        process.env.NODE_ENV = isDev ? 'development' : 'production';
    }

    try {
        if (isDev) {
            ArksServerLogger.info(ServerMessage.configurationOptionsPriorityReminder);
            ArksServerLogger.emptyLine();
        }

        const isDotEnvFileExists: boolean = fs.existsSync(path.resolve(cwd, `./${arksDefaultConfig.DOT_ENV_FILE}`));
        or(isDotEnvFileExists, () => {
            ArksServerLogger.info(ServerMessage.usingDotEnvFile);
            dotenv.config({ path: path.resolve(cwd, `./${arksDefaultConfig.DOT_ENV_FILE}`) });
        }, () => {
            ArksServerLogger.info(ServerMessage.noDotEnvFile);
        });

        let arksJsonFile: { [key: string]: any } = {};
        const isArkJsonFileExists: boolean = fs.existsSync(path.resolve(cwd, `./${arksDefaultConfig.CONFIG_FILE}`));
        or(isArkJsonFileExists, () => {
            ArksServerLogger.info(ServerMessage.usingArksJsonFile);
            arksJsonFile = JSON.parse(
                fs.readFileSync(path.resolve(cwd, `./${arksDefaultConfig.CONFIG_FILE}`), 
                { encoding: 'utf-8', flag: 'r'}
            ).toString());
        }, () => {
            ArksServerLogger.info(ServerMessage.noArksJsonFile);
        });
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ServerMessage.initializing);
        ArksServerLogger.emptyLine();

        const PORT = normalizePort(options.port || process.env.PORT || `${arksDefaultConfig.PORT}`, arksDefaultConfig.PORT);
        const HOST = options.host || process.env.HOST || arksDefaultConfig.HOST;
        const PROTOCOL = options.protocol || process.env.PROTOCOL || arksDefaultConfig.PROTOCOL;

        const {
            lanUrlForTerminal,
            localUrlForTerminal,
            localUrlForBrowser,
        } = prepareUrls(PROTOCOL, HOST, PORT);

        const arksServer = createArksServer({
            appName: !isNil(arksJsonFile.appName) && isString(arksJsonFile.appName) ? arksJsonFile.appName : arksDefaultConfig.APP_NAME,

            noMetrics: !isNil(arksJsonFile.noMetrics) && isBoolean(arksJsonFile.noMetrics) ? arksJsonFile.noMetrics : arksDefaultConfig.NO_METRICS,
            noLiveness: !isNil(arksJsonFile.noLiveness) && isBoolean(arksJsonFile.noLiveness) ? arksJsonFile.noLiveness : arksDefaultConfig.NO_LIVENESS,

            metricsEndpoint: !isNil(arksJsonFile.metricsEndpoint) && isString(arksJsonFile.metricsEndpoint) ? arksJsonFile.metricsEndpoint : arksDefaultConfig.METRICS_ENDPOINT,
            livenessEndpoint: !isNil(arksJsonFile.livenessEndpoint) && isString(arksJsonFile.livenessEndpoint) ? arksJsonFile.livenessEndpoint : arksDefaultConfig.LIVENESS_ENDPOINT,

            noHelmet: !isNil(arksJsonFile.noHelmet) && isBoolean(arksJsonFile.noHelmet) ? arksJsonFile.noHelmet : arksDefaultConfig.NO_HELMET,
            noCors: !isNil(arksJsonFile.noCors) && isBoolean(arksJsonFile.noCors) ? arksJsonFile.noCors : arksDefaultConfig.NO_CORS,
            noLimit: !isNil(arksJsonFile.noLimit) && isBoolean(arksJsonFile.noLimit) ? arksJsonFile.noLimit : arksDefaultConfig.NO_LIMIT,
            noBodyParser: !isNil(arksJsonFile.noBodyParser) && isBoolean(arksJsonFile.noBodyParser) ? arksJsonFile.noBodyParser : arksDefaultConfig.NO_BODY_PARSER,
            noCookieParser: !isNil(arksJsonFile.noCookieParser) && isBoolean(arksJsonFile.noCookieParser) ? arksJsonFile.noCookieParser : arksDefaultConfig.NO_COOKIE_PARSER,
            noCompression: !isNil(arksJsonFile.noCompression) && isBoolean(arksJsonFile.noCompression) ? arksJsonFile.noCompression : arksDefaultConfig.NO_COMPRESSION,
            
            noLogger: !isNil(arksJsonFile.noLogger) && isBoolean(arksJsonFile.noLogger) ? arksJsonFile.noLogger : arksDefaultConfig.NO_LOGGER,

            publicDirectoryPath: !isNil(arksJsonFile.publicDirectoryPath) && isString(arksJsonFile.publicDirectoryPath) ? arksJsonFile.publicDirectoryPath : arksDefaultConfig.PUBLIC_DIRECTORY_PATH,
            buildDirectoryPath: !isNil(arksJsonFile.buildDirectoryPath) && isString(arksJsonFile.buildDirectoryPath) ? arksJsonFile.buildDirectoryPath : arksDefaultConfig.BUILD_DIRECTORY_PATH,

            port: PORT,
            host: HOST,
            protocol: PROTOCOL,

            graphqlApiEndpoint: process.env.GRAPHQL_API_ENDPOINT || !isNil(arksJsonFile.graphqlApiEndpoint) && isString(arksJsonFile.graphqlApiEndpoint) ? arksJsonFile.graphqlApiEndpoint : arksDefaultConfig.GRAPHQL_API_ENDPOINT,
            
            metricsCollectTimeout: !!process.env.METRICS_COLLECT_TIMEOUT ? parseInt(process.env.METRICS_COLLECT_TIMEOUT, 10) :  !isNil(arksJsonFile.metricsCollectTimeout) && isNumber(arksJsonFile.metricsCollectTimeout) ? arksJsonFile.metricsCollectTimeout : arksDefaultConfig.METRICS_COLLECT_TIMEOUT,
            httpTimeout: !!process.env.HTTP_TIMEOUT ? parseInt(process.env.HTTP_TIMEOUT, 10) : !isNil(arksJsonFile.httpTimeout) && isNumber(arksJsonFile.httpTimeout) ? arksJsonFile.httpTimeout : arksDefaultConfig.HTTP_TIMEOUT,
            limitWindowsTimeFrameMs: !!process.env.LIMIT_WINDOWS_TIME_FRAME_MS ? parseInt(process.env.LIMIT_WINDOWS_TIME_FRAME_MS, 10) : !isNil(arksJsonFile.limitWindowsTimeFrameMs) && isNumber(arksJsonFile.limitWindowsTimeFrameMs) ? arksJsonFile.limitWindowsTimeFrameMs : arksDefaultConfig.LIMIT_WINDOWS_TIME_FRAME_MS,
            limitMaxRequestsPerIp: !!process.env.LIMIT_MAX_REQUESTS_PER_IP ? parseInt(process.env.LIMIT_MAX_REQUESTS_PER_IP, 10) : !isNil(arksJsonFile.limitMaxRequestsPerIp) && isNumber(arksJsonFile.limitMaxRequestsPerIp) ? arksJsonFile.limitMaxRequestsPerIp : arksDefaultConfig.LIMIT_MAX_REQUESTS_PER_IP,

        }, isDev);

        await arksServer.setExpressApp();
        
        ArksServerLogger.info(ServerMessage.initialized);
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ServerMessage.starting);
        ArksServerLogger.emptyLine();

        const server = http.createServer(arksServer.getExpressApp());

        const onProcessSignal = (signal: NodeJS.Signals): void => {
            ArksServerLogger.info(ServerMessage.stopping);
            ArksServerLogger.info(`Reason: signal: ${signal} received`);
            ArksServerLogger.emptyLine();

            server.close();

            ArksServerLogger.info(ServerMessage.stopped);
            ArksServerLogger.emptyLine();

            ArksServerLogger.info(ProcessMessage.uptime);
            ArksServerLogger.emptyLine();

            ArksServerLogger.info('Bye Bye Developer!');

            process.exit();
        };

        process.on('SIGINT', onProcessSignal);
        process.on('SIGTERM', onProcessSignal);
        process.on('SIGQUIT', onProcessSignal);

        server.listen(PORT, HOST);

        server.on('listening', async (): Promise<void> => {
            ArksServerLogger.info(ServerMessage.listening);
            ArksServerLogger.emptyLine();

            if (localUrlForTerminal) {
                ArksServerLogger.info(`Local:       ${localUrlForTerminal}`);
                ArksServerLogger.info(`Network:     ${lanUrlForTerminal}`);
            }
            else {
                ArksServerLogger.info(localUrlForTerminal);
            }
            ArksServerLogger.emptyLine();

            if (isDev) {
                ArksServerLogger.info(`${ServerMessage.openning} ar ${localUrlForBrowser}`);
                ArksServerLogger.emptyLine();

                await open(localUrlForBrowser);
            }
        });

        server.on('error', (err: Error): void => {
            ArksServerLogger.info(ServerMessage.error);
            ArksServerLogger.error(err.message, err.stack);
            ArksServerLogger.emptyLine();

            process.exit(1);
        });
    }
    catch (error) {
        ArksServerLogger.info(ServerMessage.startingError);
        ArksServerLogger.error(error.message || '', error.stack);
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ProcessMessage.exiting);
        process.exit(1);
    }
}