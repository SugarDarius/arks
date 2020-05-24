
import * as path from 'path';

export function getProcessDirectoryName(): string {
    return path.basename(path.resolve(process.cwd()));
}