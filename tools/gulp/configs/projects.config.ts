import * as path from 'path';
import { createProject, Project } from 'gulp-typescript';

import { packagesSource } from './sources.config';

export const projects: Map<string, Project> = new Map<string, Project>()
    .set('misc', createProject(path.resolve(
        __dirname,
        `${packagesSource}/misc/tsconfig.json`
    )))
    .set('utils', createProject(path.resolve(
        __dirname,
        `${packagesSource}/utils/tsconfig.json`
    )))
    .set('common', createProject(path.resolve(
        __dirname,
        `${packagesSource}/common/tsconfig.json`
    )))
    .set('logger', createProject(path.resolve(
        __dirname,
        `${packagesSource}/logger/tsconfig.json`
    )))
    .set('monitors', createProject(path.resolve(
        __dirname,
        `${packagesSource}/monitors/tsconfig.json`
    )))
    .set('compiler', createProject(path.resolve(
        __dirname,
        `${packagesSource}/compiler/tsconfig.json`
    )))
    .set('config', createProject(path.resolve(
        __dirname,
        `${packagesSource}/config/tsconfig.json`
    )))
    .set('react', createProject(path.resolve(
        __dirname,
        `${packagesSource}/react/tsconfig.json`
    )))
    .set('client', createProject(path.resolve(
        __dirname,
        `${packagesSource}/client/tsconfig.json`
    )))
    .set('server', createProject(path.resolve(
        __dirname,
        `${packagesSource}/server/tsconfig.json`
    )))
    .set('builder', createProject(path.resolve(
        __dirname,
        `${packagesSource}/builder/tsconfig.json`
    )))
    .set('schematics', createProject(path.resolve(
        __dirname,
        `${packagesSource}/schematics/tsconfig.json`
    )))
    .set('creator', createProject(path.resolve(
        __dirname,
        `${packagesSource}/creator/tsconfig.json`
    )))
    .set('cli', createProject(path.resolve(
        __dirname,
        `${packagesSource}/cli/tsconfig.json`
    )));

    export const packages: string[] = [ ...Array.from(projects.keys()) ];
    export const packagesForDevelopmentBuild: string[] = packages.filter((name: string): boolean => {
        return !['cli'].includes(name);
    });