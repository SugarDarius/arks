import { 
    Rule,
    Tree,
    SchematicContext 
} from '@angular-devkit/schematics';

export interface ApplicationOptions {
    name: string;
}

export function main(options: ApplicationOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        return tree;
    }
}