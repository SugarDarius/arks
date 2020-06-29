import { task } from 'gulp';
import del from 'del';

import { packagesSource } from '../configs/sources.config';

function cleanPackagesAsProduction(): any {
    return del([
        `${packagesSource}/**/*.js`,
        `${packagesSource}/**/*.d.ts`,
        `${packagesSource}/**/*.js.map`,
        `${packagesSource}/**/*.d.ts.map`,
    ]);
}

task('packages:clean:prod', (): any => cleanPackagesAsProduction());