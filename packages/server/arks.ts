import { ArksServer, ArksServerOptions } from './arks-server';

export function createArksServer(options: Required<ArksServerOptions>, isDev: boolean): ArksServer {
    return new ArksServer(options, isDev);
}