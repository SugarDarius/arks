import { ArksServerLogger } from '@arks/logger';
import { CreatorMessage } from '@arks/common';

import * as path from 'path';
import * as fs from 'fs';

import ora from 'ora';

export interface ArksProjectCreatorOptions {
    name: string;
}

export class ArksProjectCreator {
    private options: ArksProjectCreatorOptions;
    private _cwd: string;

    constructor(options: ArksProjectCreatorOptions, cwd: string) {
        this.options = options;
        this._cwd = cwd;
    }

    private createSpinner(text: string): ora.Ora {
        return ora({
            text, 
            color: 'cyan',
            spinner: 'dots',
            stream: process.stdout,
        });
    }

    private async createProjectDirectory(): Promise<void> {
        const { name } = this.options;
        const spinner = this.createSpinner(CreatorMessage.creatingProjectDirectory);

        try {
           spinner.start();

           await fs.promises.mkdir(path.resolve(this._cwd, `./${name}`));

           spinner.stop();
           ArksServerLogger.info(CreatorMessage.projectDirectoryCreated);
        }
        catch (err) {
            spinner.stop();

            ArksServerLogger.info(CreatorMessage.projectDirectoryCreationError);
            ArksServerLogger.error(err.message || err, err.stack);
        }
    }

    async runCreator(): Promise<void> {
        const { name } = this.options;

        if (fs.existsSync(path.resolve(this._cwd, `./${name}`))) {
            ArksServerLogger.error(CreatorMessage.directoryWithProjectNameAlreadyExists(name));
            ArksServerLogger.info(CreatorMessage.projectionCreationAborted);
        }
        else {
            const startBuildTime = process.hrtime();

            await this.createProjectDirectory();

            const elapsedBuildTime = process.hrtime(startBuildTime);

            // Note: for precision
            const elapsedBuildTimeNs = elapsedBuildTime[0] * 1e9 + elapsedBuildTime[1];
            const elapsedBuildTimeMs = elapsedBuildTimeNs / 1000000;
            const elapsedBuildTimeS = elapsedBuildTimeMs / 1000;
            
            ArksServerLogger.info(CreatorMessage.creationTotaltime(elapsedBuildTimeS));
        }
    }
}