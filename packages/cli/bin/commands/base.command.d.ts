import { Command } from 'commander';
import { BaseAction } from '../actions';
export declare abstract class BaseCommand {
    protected action: BaseAction;
    constructor(action: BaseAction);
    abstract load(program: Command): void;
}
