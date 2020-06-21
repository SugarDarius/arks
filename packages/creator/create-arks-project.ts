import { ArksServerLogger } from '@arks/logger';
import { CreatorMessage, ProcessMessage } from '@arks/common';

import { createArksProjectCreator } from './create-arks-project-creator';

export async function createArksProject(name: string): Promise<void> {
    const cwd: string = process.cwd();

    try {
        ArksServerLogger.info(CreatorMessage.startCreatingProject);
        ArksServerLogger.emptyLine();

        const arksProjectCreate = createArksProjectCreator({
            name,
        }, cwd);

        await arksProjectCreate.runCreator();

        ArksServerLogger.info(CreatorMessage.projectCreated);
        ArksServerLogger.emptyLine();

        ArksServerLogger.info(ProcessMessage.uptime(process.uptime()));
        ArksServerLogger.emptyLine();
        
        const onProcessSignal = (signal: NodeJS.Signals): void => {
            ArksServerLogger.info(CreatorMessage.projectCreationStopped);
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
        ArksServerLogger.info(CreatorMessage.projectCreationError);
        ArksServerLogger.error(err.message || err, err.stack);
        ArksServerLogger.emptyLine();
        ArksServerLogger.info(ProcessMessage.exiting);
        process.exit(1);
    }
} 