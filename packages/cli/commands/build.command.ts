import { buildArksProject } from '@arks/builder';

export async function BuildCommand(): Promise<void> {
    await buildArksProject();
}