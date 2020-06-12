import { InputCommand } from '../types';
export declare abstract class BaseAction {
    abstract handle(inputs?: InputCommand[], options?: InputCommand[]): Promise<void>;
}
