
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
import * as ArksDefaultConfig from '@arks/config';

import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as http from 'http';

import open from 'open';

import { createArksServer } from './create-arks-server';

export type StartArksServerOptions = {
    port?: string;
    host?: string;
    protocol?: string;
    openWebrowser?: boolean;
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

        const isDotEnvFileExists: boolean = fs.existsSync(path.resolve(cwd, `./${ArksDefaultConfig.DOT_ENV_FILE}`));
        
        or(isDotEnvFileExists, () => {
            ArksServerLogger.info(ServerMessage.usingDotEnvFile);
            dotenv.config({ path: path.resolve(cwd, `./${ArksDefaultConfig.DOT_ENV_FILE}`) });
        }, () => {
            ArksServerLogger.info(ServerMessage.noDotEnvFile);
        });

        let arksJsonFile: { [key: string]: any } = {};
        const isArkJsonFileExists: boolean = fs.existsSync(path.resolve(cwd, `./${ArksDefaultConfig.CONFIG_FILE}`));
        
        or(isArkJsonFileExists, () => {
            ArksServerLogger.info(ServerMessage.usingArksJsonFile);
            arksJsonFile = JSON.parse(
                fs.readFileSync(path.resolve(cwd, `./${ArksDefaultConfig.CONFIG_FILE}`), 
                { 
                    encoding: 'utf-8', 
                    flag: 'r'
                }
            ).toString());
        }, () => {
            ArksServerLogger.info(ServerMessage.noArksJsonFile);
        });

        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ServerMessage.initializing);
        ArksServerLogger.emptyLine();

        // CLI command option > ENV > Default config
        const PORT = normalizePort(options.port || process.env.PORT || `${ArksDefaultConfig.PORT}`, ArksDefaultConfig.PORT);
        const HOST = options.host || process.env.HOST || ArksDefaultConfig.HOST;
        const PROTOCOL = options.protocol || process.env.PROTOCOL || ArksDefaultConfig.PROTOCOL;

        const {
            lanUrlForTerminal,
            localUrlForTerminal,
            localUrlForBrowser,
        } = prepareUrls(PROTOCOL, HOST, PORT);

        const arksServer = createArksServer({
            // From Arks json file config
            appName: !isNil(arksJsonFile.appName) && isString(arksJsonFile.appName) ? arksJsonFile.appName : ArksDefaultConfig.APP_NAME,

            noMetrics: !isNil(arksJsonFile.noMetrics) && isBoolean(arksJsonFile.noMetrics) ? arksJsonFile.noMetrics : ArksDefaultConfig.NO_METRICS,
            noLiveness: !isNil(arksJsonFile.noLiveness) && isBoolean(arksJsonFile.noLiveness) ? arksJsonFile.noLiveness : ArksDefaultConfig.NO_LIVENESS,

            metricsEndpoint: !isNil(arksJsonFile.metricsEndpoint) && isString(arksJsonFile.metricsEndpoint) ? arksJsonFile.metricsEndpoint : ArksDefaultConfig.METRICS_ENDPOINT,
            livenessEndpoint: !isNil(arksJsonFile.livenessEndpoint) && isString(arksJsonFile.livenessEndpoint) ? arksJsonFile.livenessEndpoint : ArksDefaultConfig.LIVENESS_ENDPOINT,

            noHelmet: !isNil(arksJsonFile.noHelmet) && isBoolean(arksJsonFile.noHelmet) ? arksJsonFile.noHelmet : ArksDefaultConfig.NO_HELMET,
            noCors: !isNil(arksJsonFile.noCors) && isBoolean(arksJsonFile.noCors) ? arksJsonFile.noCors : ArksDefaultConfig.NO_CORS,
            noLimit: !isNil(arksJsonFile.noLimit) && isBoolean(arksJsonFile.noLimit) ? arksJsonFile.noLimit : ArksDefaultConfig.NO_LIMIT,
            noBodyParser: !isNil(arksJsonFile.noBodyParser) && isBoolean(arksJsonFile.noBodyParser) ? arksJsonFile.noBodyParser : ArksDefaultConfig.NO_BODY_PARSER,
            noCookieParser: !isNil(arksJsonFile.noCookieParser) && isBoolean(arksJsonFile.noCookieParser) ? arksJsonFile.noCookieParser : ArksDefaultConfig.NO_COOKIE_PARSER,
            noCompression: !isNil(arksJsonFile.noCompression) && isBoolean(arksJsonFile.noCompression) ? arksJsonFile.noCompression : ArksDefaultConfig.NO_COMPRESSION,
            
            noLogger: !isNil(arksJsonFile.noLogger) && isBoolean(arksJsonFile.noLogger) ? arksJsonFile.noLogger : ArksDefaultConfig.NO_LOGGER,

            // From CLI commmand option or ENV
            port: PORT,
            host: HOST,
            protocol: PROTOCOL,

            // From ENV config
            graphqlApiEndpoint: process.env.GRAPHQL_API_ENDPOINT || !isNil(arksJsonFile.graphqlApiEndpoint) && isString(arksJsonFile.graphqlApiEndpoint) ? arksJsonFile.graphqlApiEndpoint : ArksDefaultConfig.GRAPHQL_API_ENDPOINT,
            
            metricsCollectTimeout: !!process.env.METRICS_COLLECT_TIMEOUT ? parseInt(process.env.METRICS_COLLECT_TIMEOUT, 10) :  !isNil(arksJsonFile.metricsCollectTimeout) && isNumber(arksJsonFile.metricsCollectTimeout) ? arksJsonFile.metricsCollectTimeout : ArksDefaultConfig.METRICS_COLLECT_TIMEOUT,
            httpTimeout: !!process.env.HTTP_TIMEOUT ? parseInt(process.env.HTTP_TIMEOUT, 10) : !isNil(arksJsonFile.httpTimeout) && isNumber(arksJsonFile.httpTimeout) ? arksJsonFile.httpTimeout : ArksDefaultConfig.HTTP_TIMEOUT,
            limitWindowsTimeFrameMs: !!process.env.LIMIT_WINDOWS_TIME_FRAME_MS ? parseInt(process.env.LIMIT_WINDOWS_TIME_FRAME_MS, 10) : !isNil(arksJsonFile.limitWindowsTimeFrameMs) && isNumber(arksJsonFile.limitWindowsTimeFrameMs) ? arksJsonFile.limitWindowsTimeFrameMs : ArksDefaultConfig.LIMIT_WINDOWS_TIME_FRAME_MS,
            limitMaxRequestsPerIp: !!process.env.LIMIT_MAX_REQUESTS_PER_IP ? parseInt(process.env.LIMIT_MAX_REQUESTS_PER_IP, 10) : !isNil(arksJsonFile.limitMaxRequestsPerIp) && isNumber(arksJsonFile.limitMaxRequestsPerIp) ? arksJsonFile.limitMaxRequestsPerIp : ArksDefaultConfig.LIMIT_MAX_REQUESTS_PER_IP,

            // Cannot be changed config
            sourceDirectoryPath: ArksDefaultConfig.SOURCE_DIRECTORY_PATH,
            publicDirectoryPath: ArksDefaultConfig.PUBLIC_DIRECTORY_PATH,
            appComponentFilename: ArksDefaultConfig.APP_COMPONENT_FILENAME,
            compiledClientSourceDirectoryPath: ArksDefaultConfig.COMPILED_CLIENT_SOURCE_DIRECTORY_PATH,
            compiledServerSourceDirectoryPath: ArksDefaultConfig.COMPILED_SERVER_SOURCE_DIRECTORY_PATH,
            compiledClientBundleFilename: ArksDefaultConfig.COMPILED_CLIENT_BUNDLE_FILENAME,
            compiledAppComponentFilename: ArksDefaultConfig.COMPILED_APP_COMPONENT_FILENAME,
            reactAppClientEntryFilePath: ArksDefaultConfig.REACT_APP_CLIENT_ENTRY_FILE_PATH,
            reactAppClientRootFilePath: ArksDefaultConfig.REACT_APP_CLIENT_ROOT_FILE_PATH,
            reactAppRootNodeId: ArksDefaultConfig.REACT_APP_ROOT_NODE_ID,
            internalGraphQLEndpoint: ArksDefaultConfig.INTERNAL_GRAPHQL_ENDPOINT,

            localUrlForTerminal,
        }, isDev, cwd);

        await arksServer.setExpressApp(async (isFirstBuild: boolean): Promise<void> => {
            if (isDev && isFirstBuild) {
                ArksServerLogger.info(`${ServerMessage.openning} at ${localUrlForBrowser}!`);
                ArksServerLogger.emptyLine();

                await open(localUrlForBrowser);
            }
        });
        
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

            ArksServerLogger.info(ProcessMessage.uptime(process.uptime()));
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

            if (!isDev && options.openWebrowser) {
                ArksServerLogger.info(`${ServerMessage.openning} at ${localUrlForBrowser}!`);
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
    catch (err) {
        ArksServerLogger.info(ServerMessage.startingError);
        ArksServerLogger.error(err.message || err, err.stack);
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ProcessMessage.exiting);
        process.exit(1);
    }
}