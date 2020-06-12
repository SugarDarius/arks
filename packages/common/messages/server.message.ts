
import { getNodeEnv } from '@arks/utils';

const nodeEnv: string = getNodeEnv();

export type TSeverMessage = {
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
    noHelmet: string;
    noCors: string;
    noLimit: string;
    noBodyParser: string;
    noCookieParser: string;
    noCompression: string;
    noLogger: string;
};

export const ServerMessage: TSeverMessage = {
    initializing: `Initializing server as ${nodeEnv}!`,
    initialized: `Server initialized as ${nodeEnv}!`,
    starting: `Starting server as ${nodeEnv}!`,
    startingError: `Error while starting server as ${nodeEnv}`,
    listening: `Server listening as ${nodeEnv}!`,
    error: `Server error as ${nodeEnv}`,
    stopping: `Stopping server as ${nodeEnv}!`,
    stopped: `Server stopped!`,
    openning: `Opening React Application in the default browser!`,
    noMetrics: `Option "noMetrics" detected, the MetricsController creation is bypassed and not added into the server!`,
    creatingMetricsController: `Creating MetricsController!`,
    metricsControllerCreated: `MetricsController created!`,
    metricsControllerAdded: `MetricsController added into the server!`,
    noLiveness: `Option "noLiveness" detected, the LivenessController creation is bypassed and not added into the server!`,
    creatingLivenessController: `Creating LivenessController!`,
    livenessControllerCreated: `LivenessController created!`,
    livenessControllerAdded: `LivenessController added into the server!`,
    noHelmet: `Option "noHelmet" detected, the middleware "helmet" is not added into the server!`,
    noCors: `Option "noCors" detected, the middleware "cors" is not added into the server!`,
    noLimit: `Option "noLimit" detected, the middleware "limit" is not added into the server!`,
    noBodyParser: `Option "noBodyParser" detected, the middleware "body-parser" is not added into the server!`,
    noCookieParser: `Option "noCookieParser" detected, the middleware "cookie-parser" is not added into the server!`,
    noCompression: `Option "noCompression" detected, the middleware "compression" is not added into the server!`,
    noLogger: `Option "noLogger" detected, logs are disabled into the server!`,
};