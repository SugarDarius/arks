
import { getNodeEnv } from '@arks/utils';

import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const nodeEnv = getNodeEnv();

export type CreateWebpackConfigOptions = {
    entryPointPath: string; 
    publicPath: string;
    filename: string;
    profiling?: boolean;
    useSourceMap?: boolean;
};

export function createWebpackConfig(options: CreateWebpackConfigOptions): webpack.Configuration {
    const {
        entryPointPath,
        publicPath,
        filename,
        profiling,
        useSourceMap,
    } = options;

    const isDev: boolean = nodeEnv === 'development';

    const isProd: boolean = nodeEnv === 'production';
    const isProdProfiling: boolean = isProd && !!profiling;

    const shouldUseSourceMap: boolean = !!useSourceMap;

    return {
        target: 'web',
        mode: isDev ? 'development' : 'production',
        
        bail: isProd,
        
        devtool: isDev ? 'cheap-module-source-map' : shouldUseSourceMap ? 'source-map' : false,

        entry: isDev ? [
            'react-hot-loader/patch',
            'webpack-hot-middleware',
            entryPointPath
        ] : entryPointPath,

        output: {
            publicPath,
            filename,
        },

        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
        },

        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /.(js|jsx|ts|tsx)$/,
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: 'last 2 versions'
                                    }
                                }  
                            ],
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                            'react-hot-loader/babel'
                        ],
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: isProd,
                    },
                }
            ],
        },

        plugins: [
            ...(isDev ? [ new webpack.HotModuleReplacementPlugin() ] : []),
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isProd ? 'production' : 'development'
            })
        ],

        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        keep_classnames: isProdProfiling,
                        keep_fnames: isProdProfiling,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    sourceMap: shouldUseSourceMap
                })
            ]
        },
    };
}