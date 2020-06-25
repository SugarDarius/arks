import { 
    Rule,
    Tree,
    SchematicContext,
    apply,
    mergeWith,
    template,
    url,
    move,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { DEFAULT_VERSION } from '../defaults';

export interface ApplicationOptions {
    name: string;
    version: string;
}

export function main(options: ApplicationOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const templates = url('./files');
        const parametrizedTemplates = apply(templates, [
            template({
                ...({
                    name: options.name,
                    version: options.version || DEFAULT_VERSION,
                }),
                ...strings,
            }),
            move(options.name),
        ]);

        return mergeWith(parametrizedTemplates)(tree, _context);
    }
}