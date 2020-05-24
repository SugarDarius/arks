
import { ArksConsoleDisplay } from '@arks/misc';

import * as os from 'os';
import osname from 'os-name';

import { ArksServerLogger } from '../arks-server-logger';

export function logArksServerAppInfos(version: string, withConsoleDisplay?: boolean): void {
    if (withConsoleDisplay) {
        ArksServerLogger.ui(ArksConsoleDisplay);
        ArksServerLogger.emptyLine();
    }

    ArksServerLogger.info(`Application version	: ${version}\r`);
    ArksServerLogger.info(`NodeJS version 	: ${process.version}\r`);
    ArksServerLogger.info(`OS version		: ${osname(os.platform(), os.release())}\r`);
    ArksServerLogger.emptyLine();
}