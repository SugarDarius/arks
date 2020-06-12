
import { getNodeEnv } from '@arks/utils';

export const isDev = getNodeEnv() === 'development';
export const isProd = getNodeEnv() === 'production';