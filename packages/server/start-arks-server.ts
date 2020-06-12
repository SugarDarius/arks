
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import { isDev } from './shared';
import { SERVER_CONFIG_FILE } from './configs';
import { createArksServer } from './arks';

export async function startArksServer(isDev: boolean, port?: number) {
    // read .env file
    // read SERVER_CONFIG_FILE
    console.log('hello from start server');
    console.log('process.cwd', process.cwd);
}