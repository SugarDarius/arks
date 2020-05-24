
const shell = require('shelljs');
const chalk = require('chalk');

const pkg = require('../package.json');

const { cyan } = chalk;

process.stdout.write(cyan(`------------------------------------------------------------------------\r\n`));
process.stdout.write(cyan(`=> ${pkg.name} post-install script\r\n`));
process.stdout.write(cyan(`------------------------------------------------------------------------\r\n`));

process.stdout.write(`\r\n`);

process.stdout.write(cyan(`=> Rebuilding Arks packages\r\n`));
shell.exec('npm run develop:packages');
process.stdout.write(cyan(`Done.\r\n`));

process.stdout.write(`\r\n`);

process.stdout.write(cyan(`------------------------------------------------------------------------\r\n`));
process.stdout.write(cyan(`=> ${pkg.name} post-install script done.\r\n`));
process.stdout.write(cyan(`------------------------------------------------------------------------\r\n`));

process.exit();