import { series, task, dest } from 'gulp';
import logger from 'fancy-log';

import { packagesSource } from '../configs/sources.config';
import { 
    projects,
    packages,
} from '../configs/projects.config';

// in a production build we build into the package folder for publising into the npm registry and then we clean them
const distDestPathAsProduction: string = packagesSource;

function buildPackageAsProduction(name: string) {
    const project = projects.get(name);
    const destPath = `${distDestPathAsProduction}/${name}${name === 'cli' ? '/bin' : ''}`;

    if (!project) {
        logger.error(`Project of name ${name} do not exists or is not in the set of projects as production!`);
        process.exit(1);
    }

    return project
        .src()
        .pipe(project())
        .pipe(dest(destPath));
}

packages.forEach((name: string): void => {
    task(`package:${name}:build:prod`, () => buildPackageAsProduction(name));
});

task('packages:build:prod', series([
    ...packages.map((name: string): string => {
        return `package:${name}:build:prod`;
    }),
]));