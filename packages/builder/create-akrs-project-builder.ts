import { ArksProjectBuilder, ArksProjectBuilderOptions } from './arks-project-builder';

export function createArksProjectBuilder(options: ArksProjectBuilderOptions, cwd: string): ArksProjectBuilder {
    return new ArksProjectBuilder(options, cwd);
}