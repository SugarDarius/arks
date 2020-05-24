
import { loggerDateFormat } from '@arks/common';

import moment from 'moment';
import chalk from 'chalk';

const { red, yellow, cyan, blue, white } = chalk;

export class ArksServerLogger {
    private static computeMessage(message: string, withoutPrefix?: boolean): string {
        const date: string = moment().format(loggerDateFormat);
        const prefix: string = `[Arks] {pid: ${process.pid}} - `;

        return (withoutPrefix ? '' : prefix) + `${date}\t ${message}`;
    }

    private static printStackTrace(trace?: string): void {
        if (!!trace) {
            process.stdout.write(`${trace}\n`);
        }
    }

    private static printMessage(message: string, color: chalk.Chalk, withoutPrefix?: boolean): void {
        process.stdout.write(color(this.computeMessage(message, withoutPrefix)));
    }

    private static messageToString(message: string, color: chalk.Chalk, withoutPrefix?: boolean): string {
        return color(this.computeMessage(message, withoutPrefix));
    }

    static error(message: string, trace?: string): void {
        this.printMessage(message, red);
        this.printStackTrace(trace);
    }

    static warn(message: string): void {
        this.printMessage(message, yellow);
    }

    static log(message: string): void {
        this.printMessage(message, cyan);
    }

    static info(message: string): void {
        this.printMessage(message, blue);
    }

    static infoToString(message: string): string {
        return this.messageToString(message, blue);
    }

    static ui(message: string): void {
        this.printMessage(message, white, true);
    }

    static emptyLine(): void {
        process.stdout.write(`\r\n`);
    }

    static clear(): void {
        process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    }
}