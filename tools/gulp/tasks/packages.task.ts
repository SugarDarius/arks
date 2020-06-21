import * as path from 'path';

import { series, task, dest } from 'gulp';
import { createProject, Project } from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';
import logger from 'fancy-log';

import { source } from '../configs/source.config';
import { getPackagesList } from '../utils/files.util';

const distArgNameIndex: number = process.argv.indexOf('--dist');
const distDestPath: string = distArgNameIndex < 0 ? source : process.argv[distArgNameIndex + 1];

const packagesList = getPackagesList(path.resolve(__dirname, source));

const projects: Map<string, Project> = new Map<string, Project>();

projects.set('misc', createProject(path.resolve(
    __dirname,
    `${source}/misc/tsconfig.json`
)));

projects.set('utils', createProject(path.resolve(
    __dirname,
    `${source}/utils/tsconfig.json`
)));

projects.set('common', createProject(path.resolve(
    __dirname,
    `${source}/common/tsconfig.json`
)));

projects.set('logger', createProject(path.resolve(
    __dirname,
    `${source}/logger/tsconfig.json`
)));

projects.set('monitors', createProject(path.resolve(
    __dirname,
    `${source}/monitors/tsconfig.json`
)));

projects.set('compiler', createProject(path.resolve(
    __dirname,
    `${source}/compiler/tsconfig.json`
)));

projects.set('config', createProject(path.resolve(
    __dirname,
    `${source}/config/tsconfig.json`
)));

projects.set('react', createProject(path.resolve(
    __dirname,
    `${source}/react/tsconfig.json`
)));

projects.set('client', createProject(path.resolve(
    __dirname,
    `${source}/client/tsconfig.json`
)));

projects.set('server', createProject(path.resolve(
    __dirname,
    `${source}/server/tsconfig.json`
)));

projects.set('builder', createProject(path.resolve(
    __dirname,
    `${source}/builder/tsconfig.json`
)));

projects.set('schematics', createProject(path.resolve(
    __dirname,
    `${source}/schematics/tsconfig.json`
)));

projects.set('creator', createProject(path.resolve(
    __dirname,
    `${source}/creator/tsconfig.json`
)));

const packages: string[] = [ ...Array.from(projects.keys()) ];

packagesList.forEach((name: string): void => {
    if (!packages.includes(name)) {
        logger.warn(`Package "${name}" not in the projects map for build`);
    }
});

function buildPackageAsDevelopment(name: string): any {
    const project = projects.get(name);

    if (!project) {
        logger.error(`Project of name ${name} do not exists or is not in the set of projects`);
        process.exit(1);
    }

    return project
        .src()
        .pipe(sourcemaps.init())
        .pipe(project())
        .pipe(sourcemaps.write('.', {}))
        .pipe(dest(`${distDestPath}/${name}`));
}

packages.forEach((name: string): void => {
    task(`${name}:dev`, (): any => buildPackageAsDevelopment(name));
});

task('build:dev', series(packages.map((name: string): string => {
    return `${name}:dev`;
})));