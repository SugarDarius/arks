import { ArksProjectCreator, ArksProjectCreatorOptions } from './arks-project-creator';

export function createArksProjectCreator(options: ArksProjectCreatorOptions, cwd: string): ArksProjectCreator {
    return new ArksProjectCreator(options, cwd);
}