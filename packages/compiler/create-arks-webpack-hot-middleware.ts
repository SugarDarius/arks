
import webpackHotMiddleware, { MiddlewareOptions as WebpackHotMiddlewareOptions } from 'webpack-hot-middleware';
import { ArksWebpackCompiler } from './create-arks-webpack-compiler';

export type ArksWebpackHotMiddleware = ReturnType<typeof webpackHotMiddleware>;

export function createArksWebpackHotMiddleare(compiler: ArksWebpackCompiler, options: WebpackHotMiddlewareOptions): ArksWebpackHotMiddleware {
    return webpackHotMiddleware(compiler, options);
}