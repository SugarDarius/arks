import * as path from 'path';
import { task } from 'gulp';
import logger from 'fancy-log';
import del from 'del';

import { packageDirectory } from '../configs/sources.config';

function cleanPackagesAsProduction(done: (error?: any) => void) {
    const deletedPaths = del.sync([
        `${packageDirectory}/**/*.js`,
        `${packageDirectory}/**/*.d.ts`
    ]);

    logger.info(`Cleaned files:`);
    logger.info(deletedPaths.join('\n'));

    done();
}

task('packages:clean:prod', cleanPackagesAsProduction);