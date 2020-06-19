
import { getNodeEnv } from '@arks/utils';

import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const nodeEnv = getNodeEnv();

export type CreateWebpackConfigOptions = {
    srcDirectoryPath: string | string[];
    entryPointPath: string;
    filename: string;
    tsconfigPath: string;
    hmrPath?: string;
    hmrHearbeat?: number;
    outputPath?: string;
    publicPath?: string;
    useUmdLibrary?: boolean;
    noHmr?: boolean;
    useExternals?: boolean;
    profiling?: boolean;
    useSourceMap?: boolean;
};

export function createWebpackConfig(options: CreateWebpackConfigOptions): webpack.Configuration {
    const {
        srcDirectoryPath,
        entryPointPath,
        hmrPath,
        hmrHearbeat,
        outputPath,
        filename,
        tsconfigPath,
        publicPath,
        useUmdLibrary,
        useExternals,
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
            `react-hot-loader/patch`,
            `webpack-hot-middleware/client${!!hmrPath ? `?path=${hmrPath}` : ''}${!!hmrHearbeat ? `&heartbeat=${hmrHearbeat}` : ''}`,
            entryPointPath
        ] : entryPointPath,

        output: {
            publicPath,
            ...(!!outputPath ? { path: outputPath } : { }),
            filename,
            ...(useUmdLibrary ? { libraryTarget: 'umd', globalObject: 'this' } : {})
        },

        ...( useExternals ? { 
            externals: {
                'react': 'react',
                'react-dom': 'react-dom',
                'react-router': 'react-router',
                'react-router-dom': 'react-router-dom',
            }
        } : { }),

        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
        },

        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /.(j|t)sx?$/,
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
                                require('@babel/preset-typescript').default,
                            ],
                            [
                                require('@babel/preset-react').default,
                                {
                                    development: isDev,
                                    useBuiltIns: true,
                                }
                            ],
                        ],
                        plugins: [
                            [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
                            [require('@babel/plugin-proposal-class-properties').default, { loose: true }],
                            ...(isDev && !noHmr ? [require('react-hot-loader/babel')] : [])
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