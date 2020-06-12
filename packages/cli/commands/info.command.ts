import { Command } from 'commander';
import { BaseCommand } from './base.command';

export class InfoCommand extends BaseCommand {
    public load(program: Command): void {
        program
            .command('info')
            .alias('i')
            .description('Display Arks cli details')
            .action(async (): Promise<void> => {
                this.action.handle();
            });
    }
}