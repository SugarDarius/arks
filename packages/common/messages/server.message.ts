
import { getNodeEnv } from '@arks/utils';

const nodeEnv: string = getNodeEnv();

export type TSeverMessage = {
    configurationOptionsPriorityReminder: string;
    usingDotEnvFile: string;
    noDotEnvFile: string;
    usingArksJsonFile: string;
    noArksJsonFile: string;
    initializing: string;
    initialized: string;
    starting: string;
    startingError: string;
    listening: string;
    error: string;
    stopping: string;
    stopped: string;
    openning: string;
    noMetrics: string;
    creatingMetricsController: string;
    metricsControllerCreated: string;
    metricsControllerAdded: string;
    noLiveness: string;
    creatingLivenessController: string;
    livenessControllerCreated: string;
    livenessControllerAdded: string;
    creatingGraphQLController: string;
    graphQlControllerCreated: string;
    graphQlControllerAdded: string;
    noHelmet: string;
    noCors: string;
    noLimit: string;
    noBodyParser: string;
    noCookieParser: string;
    noCompression: string;
    noLogger: string;
    settingPublicDirectory: string;
    publicDirectorySetted: string;
    settingBuildDirectory: string;
    buildDirectorySetted: string;
};

export const ServerMessage: TSeverMessage = {
    configurationOptionsPriorityReminder: `[Reminder] configuration options priority : cli options > .env file > arks.json file. Some configuration options are only availables from the arks.json file`,
    usingDotEnvFile: `.env file detected. Using defined options in it in the Arks configuration priority order`,
    noDotEnvFile: `No .env file detected, falling back to @arks/server pre-defined configuration options`,
    usingArksJsonFile: `arks.json file detected. Using defined options in it in the Arks configuration priority order`,
    noArksJsonFile: 'No arks.json file detected, falling back to @arks/server pre-defined configuration options',
    initializing: `Initializing server as ${nodeEnv}!`,
    initialized: `Server initialized as ${nodeEnv}!`,
    starting: `Starting server as ${nodeEnv}!`,
    startingError: `Error while starting server as ${nodeEnv}`,
    listening: `Server listening as ${nodeEnv}!`,
    error: `Server error as ${nodeEnv}`,
    stopping: `Stopping server as ${nodeEnv}!`,
    stopped: `Server stopped!`,
    openning: `Opening React Application in the default browser`,
    noMetrics: `Option "noMetrics" detected, the MetricsController creation is bypassed and not added into the server!`,
    creatingMetricsController: `Creating MetricsController!`,
    metricsControllerCreated: `MetricsController created!`,
    metricsControllerAdded: `MetricsController added into the server!`,
    noLiveness: `Option "noLiveness" detected, the LivenessController creation is bypassed and not added into the server!`,
    creatingLivenessController: `Creating LivenessController!`,
    livenessControllerCreated: `LivenessController created!`,
    livenessControllerAdded: `LivenessController added into the server!`,
    creatingGraphQLController: `Creating GraphQLController`,
    graphQlControllerCreated: 'GraphQLController created!',
    graphQlControllerAdded: `GraphQLController added into the server!`,
    noHelmet: `Option "noHelmet" detected, the middleware "helmet" is not added into the server!`,
    noCors: `Option "noCors" detected, the middleware "cors" is not added into the server!`,
    noLimit: `Option "noLimit" detected, the middleware "limit" is not added into the server!`,
    noBodyParser: `Option "noBodyParser" detected, the middleware "body-parser" is not added into the server!`,
    noCookieParser: `Option "noCookieParser" detected, the middleware "cookie-parser" is not added into the server!`,
    noCompression: `Option "noCompression" detected, the middleware "compression" is not added into the server!`,
    noLogger: `Option "noLogger" detected, logs are disabled into the server!`,
    settingPublicDirectory: `Setting public directory path to server as static on route /public`,
    publicDirectorySetted: `Public directory path setted. Static content from /public route served from `,
    settingBuildDirectory: `Setting build directory path to server as static on route /build`,
    buildDirectorySetted: `Build directory path setted. Built files for applications from /build route served from `
};