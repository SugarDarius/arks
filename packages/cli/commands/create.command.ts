import { createArksProject } from '@arks/creator';

export async function CreateCommand(name: string): Promise<void> {
    await createArksProject(name);
}