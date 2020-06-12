import { Command } from 'commander';
import { LoaderCommand } from './commands';

async function ArksCli(): Promise<void> {
    const program = new Command();

    program.version(require('../package.json').version);
    // @ts-ignore
    LoaderCommand.load(program);
    program.parse(process.argv);

    if (program.args.length === 0) {
        program.outputHelp();
    }
}

ArksCli();