import { ArksServer, ArksServerOptions } from './arks-server';

export function createArksServer(options: ArksServerOptions, isDev: boolean, cwd: string): ArksServer {
    return new ArksServer(options, isDev, cwd);
}