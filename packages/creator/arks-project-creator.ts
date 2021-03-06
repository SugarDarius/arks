import { ArksServerLogger } from '@arks/logger';
import { CreatorMessage } from '@arks/common';
import {
    findClosestBinPath,
    runShellCommand,
    sequentialTaskRunner,
} from '@arks/utils';

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

    private async createProjectDirectory(): Promise<boolean> {
        const { name } = this.options;
        const spinner = this.createSpinner(CreatorMessage.creatingProjectDirectory);

        let success = false;

        try {
           spinner.start();

           await fs.promises.mkdir(path.resolve(this._cwd, `./${name}`));
           success = true;

           spinner.stop();
           ArksServerLogger.info(CreatorMessage.projectDirectoryCreated);
        }
        catch (err) {
            spinner.stop();

            ArksServerLogger.info(CreatorMessage.projectDirectoryCreationError);
            ArksServerLogger.error(err.message || err, err.stack);
        }

        return success;
    }

    private async createFilesWithSchematics(): Promise<boolean> {
        const { name } = this.options;
        const spinner = this.createSpinner(CreatorMessage.lookingForSchematicsBinaries);

        spinner.start();
        const schematicsBinaryPath = findClosestBinPath('schematics');

        if (schematicsBinaryPath !== null) {
            spinner.stop();
            ArksServerLogger.info(CreatorMessage.schematicsBinariesFound);

            ArksServerLogger.info(CreatorMessage.executingSchematicsCommand);
            const execState = await runShellCommand({
                command: schematicsBinaryPath,
                args: [
                    `@arks/schematics:application`, 
                    `--name="${name}"`,
                ],
                cwd: this._cwd,
                logger: {
                    info: (message: string) => {
                        ArksServerLogger.info(message);
                    },
                    error: (message: string) => {
                        ArksServerLogger.error(message);
                    }
                }
            });
            ArksServerLogger.info(CreatorMessage.schematicsCommandExecuted);

            return execState.success;
        }
        else {
            spinner.stop();
            ArksServerLogger.info(CreatorMessage.schematicsBinariesNotFound);
        }

        return false;
    }

    private async runNpmInstall(): Promise<boolean> {
        const { name } = this.options;

        const execState = await runShellCommand({
            command: 'npm',
            args: [
                'install'
            ],
            cwd: `${this._cwd}/${name}`,
            logger: {
                info: (message: string) => {
                    ArksServerLogger.info(message);
                },
                error: (message: string) => {
                    ArksServerLogger.error(message);
                }
            }
        });
        
        return execState.success;
    }

    async runCreator(): Promise<void> {
        const { name } = this.options;

        if (fs.existsSync(path.resolve(this._cwd, `./${name}`))) {
            ArksServerLogger.error(CreatorMessage.directoryWithProjectNameAlreadyExists(name));
            ArksServerLogger.info(CreatorMessage.projectionCreationAborted);
        }
        else {
            const startBuildTime = process.hrtime();

            await sequentialTaskRunner(
                [
                    {
                        action: async (): Promise<boolean> => {
                            return this.createProjectDirectory();
                        }
                    },
                    {
                        action: async (): Promise<boolean> => {
                            return this.createFilesWithSchematics();
                        },
                    },
                    {
                        action: async (): Promise<boolean> => {
                            return this.runNpmInstall();
                        },
                        onStart: () => {
                            ArksServerLogger.info(CreatorMessage.executingNpmInstallCommand);
                        },
                        onSuccess: () => {
                            ArksServerLogger.info(CreatorMessage.npmInstallCommandExecuted);
                        },
                        onFail: () => {
                            ArksServerLogger.info(CreatorMessage.npmInstallCommandError);
                        }
                    }
                ],
                (): void => {
                    ArksServerLogger.info(CreatorMessage.sequentialCommandsTasksStopped);
                    ArksServerLogger.info(CreatorMessage.projectionCreationAborted);
                },
                (): void => {
                    ArksServerLogger.info(CreatorMessage.sequentialCommandsTasksEnded);

                    const elapsedBuildTime = process.hrtime(startBuildTime);

                    // Note: for precision
                    const elapsedBuildTimeNs = elapsedBuildTime[0] * 1e9 + elapsedBuildTime[1];
                    const elapsedBuildTimeMs = elapsedBuildTimeNs / 1000000;
                    const elapsedBuildTimeS = elapsedBuildTimeMs / 1000;
                    
                    ArksServerLogger.info(CreatorMessage.creationTotaltime(elapsedBuildTimeS));
                }
            );
        }
    }
}