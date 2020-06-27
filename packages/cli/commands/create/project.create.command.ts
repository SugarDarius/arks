import { createArksProject } from '@arks/creator';
import { strings } from '@angular-devkit/core';

export async function ProjectCreateCommand(name: string): Promise<void> {
    await createArksProject(strings.dasherize(name));
}