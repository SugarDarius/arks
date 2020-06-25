import * as fs from 'fs';
import * as path from 'path';

export function findClosestBinPath(name: string): string | null {
    const paths: string[] = module.paths;
    const subPath = path.join('.bin', name);

    for (const mPath of paths) {
        const binaryPath = path.resolve(mPath, subPath);
        if (fs.existsSync(binaryPath)) {
            return binaryPath;
        }
    }

    return null;
} 