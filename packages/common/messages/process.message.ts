
import { getNodeEnv } from '@arks/utils';

const nodeEnv: string = getNodeEnv();

export type TProcessMessage = {
    exiting: string;
    uptime: string;
};

export const ProcessMessage: TProcessMessage = {
    exiting: `Exiting NodeJS process pid:${process.pid} with exit code 1 as ${nodeEnv}!`,
    uptime: `NodeJS process pid:${process.pid} was up since ${Math.floor(process.uptime())}s as ${nodeEnv}!`,
};