
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
    openning: `Opening React Application in the default browser`,
};