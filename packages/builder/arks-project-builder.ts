import { BuilderMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';
import { 
    ArksWebpackCompiler,
    createArksWebpackCompiler,
    runArksWebpackCompiler,
} from '@arks/compiler';

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

    }

    private async compilesFromAClientEntryForCSR(): Promise<void> {

    }

    async runBuilder(): Promise<void> {
        await this.compilesFromAppRootForSSR();
        await this.compilesFromAClientEntryForCSR();
    }
}