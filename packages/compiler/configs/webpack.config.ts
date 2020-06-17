
import { getNodeEnv } from '@arks/utils';

import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const nodeEnv = getNodeEnv();

export type CreateWebpackConfigOptions = {
    srcDirectoryPath: string;
    entryPointPath: string;
    outputPath: string, 
    filename: string;
    tsconfigPath: string;
    publicPath?: string;
    useUmdLibrary?: boolean;
    noHmr?: boolean;
    profiling?: boolean;
    useSourceMap?: boolean;
};

export function createWebpackConfig(options: CreateWebpackConfigOptions): webpack.Configuration {
    const {
        srcDirectoryPath,
        entryPointPath,
        outputPath,
        filename,
        tsconfigPath,
        publicPath,
        useUmdLibrary,
        profiling,
        useSourceMap,
        noHmr
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

        entry: isDev && !noHmr ? [
            'react-hot-loader/patch',
            'webpack-hot-middleware',
            entryPointPath
        ] : entryPointPath,

        output: {
            publicPath,
            path: outputPath,
            filename,
            ...(useUmdLibrary ? { libraryTarget: 'umd', globalObject: 'this' } : {})
        },

        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
        },

        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /.(js|jsx|ts|tsx)$/,
                    include: srcDirectoryPath,
                    loader: require.resolve('babel-loader'),
                    options: {
                        babelrc: false,
                        configFile: false,
                        presets: [
                            [
                                require('@babel/preset-env').default,
                                {
                                    useBuiltIns: 'entry',
                                    corejs: 3,
                                    modules: false,
                                    targets: {
                                        browsers: 'last 2 versions'
                                    }
                                }  
                            ],
                            [
                                require('@babel/preset-react').default,
                                {
                                    development: isDev,
                                    useBuiltIns: true,
                                }
                            ],
                            [
                                require('@babel/preset-typescript').default,
                            ]
                        ],
                        plugins: [
                            [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
                            [require('@babel/plugin-proposal-class-properties').default, { loose: true }],
                            ...(isDev && !noHmr ? [require('react-hot-loader/babel').default] : []),
                        ],
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: isProd,
                    },
                }
            ],
        },

        plugins: [
            ...(isDev && !noHmr ? [ new webpack.HotModuleReplacementPlugin() ] : []),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsconfigPath,
                checkSyntacticErrors: true,
                silent: true,
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isProd ? '"production"' : '"development"'
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