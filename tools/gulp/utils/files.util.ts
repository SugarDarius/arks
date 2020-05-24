
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export function isDirectory(path: string): boolean {
    return statSync(path).isDirectory();
}

export function getDirectories(dir: string): string[] {
    return readdirSync(dir).filter((file: string): boolean => {
        return isDirectory(join(dir, file));
    });
}

export function getPackagesList(base: string): string[] {
    return getDirectories(base);
}