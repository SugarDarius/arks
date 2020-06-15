
import webpack from 'webpack';
import { createWebpackConfig, CreateWebpackConfigOptions } from './configs';

export type ArksWebpackCompiler = webpack.Compiler;

export function createArksWebpackCompiler(options: CreateWebpackConfigOptions): ArksWebpackCompiler {
    return webpack(createWebpackConfig(options));
}