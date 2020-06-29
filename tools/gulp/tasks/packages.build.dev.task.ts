import { series, task, dest, src } from 'gulp';
import * as sourcemaps from 'gulp-sourcemaps';
import logger from 'fancy-log';

import { packagesSource } from '../configs/sources.config';
import { 
    projects,
    packagesForDevelopmentBuild,
} from '../configs/projects.config';

import {
    FileConfig,
    schematicsFilesList,
    schematicsFiles,
} from '../configs/files.config';

const distArgNameIndex: number = process.argv.indexOf('--dist');
const distDestPathAsDevelopment: string = distArgNameIndex < 0 ? packagesSource : process.argv[distArgNameIndex + 1];

function buildPackageAsDevelopment(name: string) {
    const project = projects.get(name);

    if (!project) {
        logger.error(`Project of name ${name} do not exists or is not in the set of projects as development!`);
        process.exit(1);
    }

    return project
        .src()
        .pipe(sourcemaps.init())
        .pipe(project())
        .pipe(sourcemaps.write('.', {}))
        .pipe(dest(`${distDestPathAsDevelopment}/${name}`));
}

function copySchematicsFilesAsDevelopment(item: FileConfig) {
    const { glob, destPath, options } = item;

    return src(`${packagesSource}/schematics/${glob}`, !!options ? options : { })
        .pipe(dest(`${distDestPathAsDevelopment}/schematics${destPath}`));
}

packagesForDevelopmentBuild.forEach((name: string): void => {
    task(`package:${name}:build:dev`, () => buildPackageAsDevelopment(name));
});

schematicsFilesList.forEach((item): void => {
    task(`schematics:copy:${item.name}:dev`, () => copySchematicsFilesAsDevelopment(item));
});

task('packages:build:dev', series([
    ...packagesForDevelopmentBuild.map((name: string): string => {
        return `package:${name}:build:dev`;
    }),
    ...schematicsFiles.map((name: string): string => {
        return `schematics:copy:${name}:dev`;
    }),
]));