"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderCommand = void 0;
const logger_1 = require("@arks/logger");
const actions_1 = require("../actions");
const info_command_1 = require("./info.command");
class LoaderCommand {
    static load(program) {
        program.on('command:*', () => {
            logger_1.ArksServerLogger.error(`Invalid command: ${program.args.join(' ')}`);
            logger_1.ArksServerLogger.log(`See --help for available commands`);
            process.exit(1);
        });
        new info_command_1.InfoCommand(new actions_1.InfoAction()).load(program);
    }
}
exports.LoaderCommand = LoaderCommand;
