
import { startArksServer } from '@arks/server';

export async function DevCommand(cmd: any): Promise<void> {
    const { port } = cmd;
    await startArksServer(true, port);
}