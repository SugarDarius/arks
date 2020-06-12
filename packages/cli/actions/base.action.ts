import { InputCommand } from '../types';

export abstract class BaseAction {
    public abstract async handle(inputs?: InputCommand[], options?: InputCommand[]): Promise<void>;
}