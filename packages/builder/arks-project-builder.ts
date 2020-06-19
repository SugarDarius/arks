import { BuilderMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';
import { 
    ArksWebpackCompiler,
    createArksWebpackCompiler,
    runArksWebpackCompiler,
} from '@arks/compiler';

import * as path from 'path';
import * as fs from 'fs';

import ora from 'ora';

export interface ArksProjectBuilderOptions {
    sourceDirectoryPath: string;
    appComponentFilename: string;
    compiledClientSourceDirectoryPath: string;
    compiledServerSourceDirectoryPath: string;
    compiledClientBundleFilename: string;
    compiledAppComponentFilename: string;
    reactAppClientEntryFilePath: string;
}

export class ArksProjectBuilder {
    private options: ArksProjectBuilderOptions;
    private _cwd: string;

    constructor(options: ArksProjectBuilderOptions, cwd: string) {
        this.options = options;
        this._cwd = cwd;
    }

    private async compilesFromAppRootForSSR(): Promise<void> {
        const {
            sourceDirectoryPath,
            appComponentFilename,
            compiledAppComponentFilename,
            compiledServerSourceDirectoryPath,
        } = this.options;

        let compiler: ArksWebpackCompiler | null = null;
        try {
            ArksServerLogger.info(BuilderMessage.creatingServerArksWebpackCompiler);
            
            compiler = createArksWebpackCompiler({
                srcDirectoryPath:  path.resolve(this._cwd, `./${sourceDirectoryPath}`),
                entryPointPath: path.resolve(this._cwd, `./${sourceDirectoryPath}/${appComponentFilename}`),
                outputPath: path.resolve(this._cwd, `./${compiledServerSourceDirectoryPath}`),
                filename: compiledAppComponentFilename,
                tsconfigPath: path.resolve(this._cwd, './tsconfig.json'),
                useExternals: true,
                useUmdLibrary: true,
                noHmr: true,
                profiling: true,
                isProd: true,
            });
        }
        catch (err) {
            ArksServerLogger.info(BuilderMessage.arksServerWebpackCompilerCreationError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();

        const spinner = ora({ 
            text: `${BuilderMessage.compilingReactAppForServerSideRendering}`, 
            color: 'cyan',
            spinner: 'dots',
            stream: process.stdout,
        });

        try {
            const isReactAppServerRootExists: boolean = fs.existsSync(path.resolve(this._cwd, `./${compiledServerSourceDirectoryPath}`));
            if (isReactAppServerRootExists) {
                await fs.promises.rmdir(path.resolve(this._cwd, `./${compiledServerSourceDirectoryPath}`), {
                    recursive: true,
                    maxRetries: 2
                });
            }

            if (compiler !== null) {
                spinner.start();
                const compilerResult = await runArksWebpackCompiler(compiler);

                spinner.stop();
                ArksServerLogger.info(BuilderMessage.reactAppCompilationForServerSideRenderingSuccess);
                ArksServerLogger.emptyLine();

                ArksServerLogger.logRaw(compilerResult.toString({ colors: true, chunks: true }), true);
            }
        }
        catch (err) {
            spinner.stop();
            ArksServerLogger.info(BuilderMessage.reactAppCompilationForServerSideRenderingError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();
    }

    private async compilesFromAClientEntryForCSR(): Promise<void> {
        const {
            compiledClientSourceDirectoryPath,
            reactAppClientEntryFilePath,
            sourceDirectoryPath,
            compiledClientBundleFilename,
        } = this.options;

        let compiler: ArksWebpackCompiler | null = null;
        try {
            ArksServerLogger.info(BuilderMessage.creatingClientArksWebpackCompiler);
            
            compiler = createArksWebpackCompiler({
                srcDirectoryPath: [
                    path.resolve(this._cwd, `./.arks/client`),
                    path.resolve(this._cwd, `./${sourceDirectoryPath}`)
                ],
                entryPointPath: path.resolve(this._cwd, `./${reactAppClientEntryFilePath}`),
                outputPath: path.resolve(this._cwd, `./${compiledClientSourceDirectoryPath}`),
                filename: compiledClientBundleFilename,
                tsconfigPath: path.resolve(this._cwd, './tsconfig.json'),
                noHmr: true,
                profiling: true,
                isProd: true,
            });

            ArksServerLogger.info(BuilderMessage.clientArksWebpackCompilerCreated);
        }
        catch (err) {
            ArksServerLogger.info(BuilderMessage.arksClientWebpackCompilerCreationError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();

        const spinner = ora({ 
            text: `${BuilderMessage.compilingReactAppForClientSideRendering}`, 
            color: 'cyan',
            spinner: 'dots',
            stream: process.stdout,
        }); 

        try {
            const isReactAppClientBuildDirectoryExists: boolean = fs.existsSync(path.resolve(this._cwd, `./${compiledClientSourceDirectoryPath}`));
            if (isReactAppClientBuildDirectoryExists) {
                await fs.promises.rmdir(path.resolve(this._cwd, `./${compiledClientSourceDirectoryPath}`), {
                    recursive: true,
                    maxRetries: 2
                });
            }

            if (compiler !== null) {
                spinner.start();
                const compilerResult = await runArksWebpackCompiler(compiler);

                spinner.stop();
                ArksServerLogger.info(BuilderMessage.reactAppCompilationForClientSideRenderingSuccess);
                ArksServerLogger.emptyLine();

                ArksServerLogger.logRaw(compilerResult.toString({ 
                    colors: true, 
                    chunks: true,
                    warnings: false,
                }), true);
            }
        }
        catch (err) {
            spinner.stop();
            ArksServerLogger.info(BuilderMessage.reactAppCompilationForClientSideRenderingError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        ArksServerLogger.emptyLine();
    }

    async runBuilder(): Promise<void> {
        const startBuildTime = process.hrtime();

        await this.compilesFromAppRootForSSR();
        await this.compilesFromAClientEntryForCSR();

        const elapsedBuildTime = process.hrtime(startBuildTime);

        // Note: for precision
        const elapsedBuildTimeNs = elapsedBuildTime[0] * 1e9 + elapsedBuildTime[1];
        const elapsedBuildTimeMs = elapsedBuildTimeNs / 1000000;
        const elapsedBuildTimeS = elapsedBuildTimeMs / 1000;

        ArksServerLogger.info(BuilderMessage.buildTotalTime(elapsedBuildTimeS));
    }
}