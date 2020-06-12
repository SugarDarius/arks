"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const commands_1 = require("./commands");
function ArksCli() {
    return __awaiter(this, void 0, void 0, function* () {
        const program = new commander_1.Command();
        program.version(require('../package.json').version);
        // @ts-ignore
        commands_1.LoaderCommand.load(program);
        program.parse(process.argv);
        if (program.args.length === 0) {
            program.outputHelp();
        }
    });
}
ArksCli();
