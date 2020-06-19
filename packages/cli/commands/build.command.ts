import { buildArksProject } from '@arks/builder';

export async function BuildCommand(cmd: any): Promise<void> {
    const { useSourceMap } = cmd;
    await buildArksProject(useSourceMap);
}