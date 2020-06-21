#!/usr/bin/env node

import { ArksConsoleDisplay } from '@arks/misc';
import { program } from 'commander';
import chalk from 'chalk';

import * as Commands from './commands';

async function Arks(): Promise<void> {
    const pkg = require('../package.json');

    process.stdout.write(chalk.white(ArksConsoleDisplay));
    process.stdout.write('\r\n');

    program
        .name('arks')
        .version(pkg.version, '-v, --version')
        .helpOption('-h, --help', 'read more information');
    
    program
        .command('dev')
        .description('Start an Arks project as development')
        .option('-p, --port <number>', 'Specific port to use', '8080')
        .option('-s, --host <string>', 'Specific host to use', '0.0.0.0')
        .option('-p, --protocol <string>', 'Specific protocol to use [http | https]', 'http')
        .action(Commands.DevCommand);

    program
        .command('build')
        .description('Build an Arks project as production')
        .option('--use-source-map', 'Use source map for build', false)
        .action(Commands.BuildCommand);

    program
        .command('start')
        .description('Start an Arks project as production')
        .option('-p, --port <number>', 'Specific port to use', '8080')
        .option('-s, --host <string>', 'Specific host to use', '0.0.0.0')
        .option('-p, --protocol <string>', 'Specific protocol to use [http | https]', 'http')
        .option('-o, --open', 'Open web browser for testing production build on a local machine', false)
        .action(Commands.StartCommand);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(0);
    }

    await program.parseAsync(process.argv);
}

Arks();