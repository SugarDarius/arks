import * as path from 'path';

import { series, task, dest, src } from 'gulp';
import { createProject, Project } from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';
import logger from 'fancy-log';

import { packagesSource } from '../configs/sources.config';
import { getPackagesList } from '../utils/files.util';

const distArgNameIndex: number = process.argv.indexOf('--dist');
const distDestPath: string = distArgNameIndex < 0 ? packagesSource : process.argv[distArgNameIndex + 1];

const packagesList = getPackagesList(path.resolve(__dirname, packagesSource));

const projects: Map<string, Project> = new Map<string, Project>();

projects.set('misc', createProject(path.resolve(
    __dirname,
    `${packagesSource}/misc/tsconfig.json`
)));

projects.set('utils', createProject(path.resolve(
    __dirname,
    `${packagesSource}/utils/tsconfig.json`
)));

projects.set('common', createProject(path.resolve(
    __dirname,
    `${packagesSource}/common/tsconfig.json`
)));

projects.set('logger', createProject(path.resolve(
    __dirname,
    `${packagesSource}/logger/tsconfig.json`
)));

projects.set('monitors', createProject(path.resolve(
    __dirname,
    `${packagesSource}/monitors/tsconfig.json`
)));

projects.set('compiler', createProject(path.resolve(
    __dirname,
    `${packagesSource}/compiler/tsconfig.json`
)));

projects.set('config', createProject(path.resolve(
    __dirname,
    `${packagesSource}/config/tsconfig.json`
)));

projects.set('react', createProject(path.resolve(
    __dirname,
    `${packagesSource}/react/tsconfig.json`
)));

projects.set('client', createProject(path.resolve(
    __dirname,
    `${packagesSource}/client/tsconfig.json`
)));

projects.set('server', createProject(path.resolve(
    __dirname,
    `${packagesSource}/server/tsconfig.json`
)));

projects.set('builder', createProject(path.resolve(
    __dirname,
    `${packagesSource}/builder/tsconfig.json`
)));

projects.set('schematics', createProject(path.resolve(
    __dirname,
    `${packagesSource}/schematics/tsconfig.json`
)));


projects.set('creator', createProject(path.resolve(
    __dirname,
    `${packagesSource}/creator/tsconfig.json`
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

// TODO: TO REFACTOR LATER
function copyPackageJsonFileForSchematics(): any {
    return src(`${packagesSource}/schematics/package.json`).pipe(dest(`${distDestPath}/schematics`));
}

function copyCollectionJsonFileForSchematics(): any {
    return src(`${packagesSource}/schematics/collection.json`).pipe(dest(`${distDestPath}/schematics`));
}

function copyApplicationTemplateFilesForSchematics(): any {
    return src(`${packagesSource}/schematics/application/files/**/*`, { dot: true }).pipe(dest(`${distDestPath}/schematics/application/files`));
}

function copyApplicationSchemaJsonFileForSchematics(): any {
    return src(`${packagesSource}/schematics/application/schema.json`).pipe(dest(`${distDestPath}/schematics/application`));
}

packages.forEach((name: string): void => {
    task(`${name}:build:dev`, (): any => buildPackageAsDevelopment(name));
});

task('schematics:copy:package:dev', (): any => copyPackageJsonFileForSchematics());
task('schematics:copy:collection:dev', (): any => copyCollectionJsonFileForSchematics());
task('schematics:copy:application:template:dev', (): any => copyApplicationTemplateFilesForSchematics());
task('schematics:copy:application:schema:dev', (): any => copyApplicationSchemaJsonFileForSchematics());

task('build:dev', series([
    ...packages.map((name: string): string => {
        return `${name}:build:dev`;
    }),
    'schematics:build:dev',
    'schematics:copy:package:dev',
    'schematics:copy:collection:dev',
    'schematics:copy:application:template:dev',
    'schematics:copy:application:schema:dev',
]));