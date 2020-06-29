import { series, task, src, dest } from 'gulp';

import { packagesSource } from '../configs/sources.config';
import { packages } from '../configs/projects.config';

function copyMiscFilesAsProduction(name: string) {
    return src([
        'LICENSE',
        '.npmignore',
    ])
    .pipe(dest(`${packagesSource}/${name}`));
}

packages.forEach((name: string): void => {
    task(`package:${name}:copy:misc:files:prod`, () => copyMiscFilesAsProduction(name)); 
});

task('packages:copy:misc:files:prod', series([
    ...packages.map((name: string): string => {
        return `package:${name}:copy:misc:files:prod`;
    })
]));
