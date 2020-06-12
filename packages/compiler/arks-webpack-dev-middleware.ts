
import webpackDevMiddleware, { WebpackDevMiddleware, Options as WebpackDevMiddlewareOptions } from 'webpack-dev-middleware';
import { ArksWebpackCompiler } from './arks-webpack-compiler';

export type ArksWebpackDevMiddleware = WebpackDevMiddleware

export function createArksWebpackDevMiddleware(compiler: ArksWebpackCompiler, options: WebpackDevMiddlewareOptions): ArksWebpackDevMiddleware {
    return webpackDevMiddleware(compiler, options);
}