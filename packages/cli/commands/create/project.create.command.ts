import { createArksProject } from '@arks/creator';

export async function ProjectCreateCommand(name: string): Promise<void> {
    await createArksProject(name);
}