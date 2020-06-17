import webpack from 'webpack';
import { ArksWebpackCompiler } from './create-arks-webpack-compiler';

export type ArksWebpackCompilerResult = webpack.Stats;

export function runArksWebpackCompiler(compiler: ArksWebpackCompiler): Promise<ArksWebpackCompilerResult> {
    return new Promise(async (resolve, reject) => {
        compiler.run((err: Error, stats: webpack.Stats) => {
            if (!!err) {
                return reject(err);
            }
            
            if (stats.hasErrors()) {
                const { errors } = stats.toJson();
                return reject(errors);
            }

            resolve(stats);
        });
    });
}