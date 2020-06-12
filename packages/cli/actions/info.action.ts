
import { logArksServerAppInfos } from '@arks/logger';
import { BaseAction } from './base.action';

export class InfoAction extends BaseAction {
    public async handle(): Promise<void> {
        logArksServerAppInfos(require('../../package.json').version, true);
    }
}