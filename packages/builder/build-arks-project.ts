import { ArksServerLogger } from '@arks/logger';
import { BuilderMessage, ProcessMessage } from '@arks/common';
import * as ArksDefaultConfig from '@arks/config';

import { createArksProjectBuilder } from './create-akrs-project-builder';

export async function buildArksProject(): Promise<void> {
    const cwd: string = process.cwd();
    process.env.NODE_ENV = 'production';

    try {
        ArksServerLogger.info(BuilderMessage.startBuildingProject);
        ArksServerLogger.emptyLine();

        const arksProjectBuilder = createArksProjectBuilder({
            sourceDirectoryPath: ArksDefaultConfig.SOURCE_DIRECTORY_PATH,
            appComponentFilename: ArksDefaultConfig.APP_COMPONENT_FILENAME,
            compiledClientSourceDirectoryPath: ArksDefaultConfig.COMPILED_CLIENT_SOURCE_DIRECTORY_PATH,
            compiledServerSourceDirectoryPath: ArksDefaultConfig.COMPILED_SERVER_SOURCE_DIRECTORY_PATH,
            compiledClientBundleFilename: ArksDefaultConfig.COMPILED_CLIENT_BUNDLE_FILENAME,
            compiledAppComponentFilename: ArksDefaultConfig.COMPILED_APP_COMPONENT_FILENAME,
            reactAppClientEntryFilePath: ArksDefaultConfig.REACT_APP_CLIENT_ENTRY_FILE_PATH,
        }, cwd);
        
        await arksProjectBuilder.runBuilder();
        
        ArksServerLogger.info(BuilderMessage.projectBuilded);
        ArksServerLogger.emptyLine();

        const onProcessSignal = (signal: NodeJS.Signals): void => {
            ArksServerLogger.info(BuilderMessage.buildStopped);
            ArksServerLogger.info(`Reason: signal: ${signal} received`);
            ArksServerLogger.emptyLine();

            ArksServerLogger.info(ProcessMessage.uptime(process.uptime()));
            ArksServerLogger.emptyLine();

            ArksServerLogger.info('Bye Bye Developer!');

            process.exit();
        };

        process.on('SIGINT', onProcessSignal);
        process.on('SIGTERM', onProcessSignal);
        process.on('SIGQUIT', onProcessSignal);
    }
    catch (err) {
        ArksServerLogger.info(BuilderMessage.buildProjectError);
        ArksServerLogger.error(err.message || err, err.stack);
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ProcessMessage.exiting);
        process.exit(1);
    }
}