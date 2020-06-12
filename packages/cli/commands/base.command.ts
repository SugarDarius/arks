import { Command } from 'commander';
import { BaseAction } from '../actions';

export abstract class BaseCommand {
    constructor(
        protected action: BaseAction
    ) { }

    public abstract load(program: Command): void;
}