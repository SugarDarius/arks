import { ArksServerLogger } from '@arks/logger';
import { Command } from 'commander';

import { InfoAction } from '../actions';
import { InfoCommand } from './info.command';

export class LoaderCommand {
    public static load(program: Command): void {
        program.on('command:*', (): void => {
            ArksServerLogger.error(`Invalid command: ${program.args.join(' ')}`);
            ArksServerLogger.log(`See --help for available commands`);

            process.exit(1);
        });

        new InfoCommand(new InfoAction()).load(program);
    }
}