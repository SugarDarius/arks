
import { startArksServer } from '@arks/server';

export async function DevCommand(cmd: any): Promise<void> {
    const { 
        port, 
        host, 
        protocol,
    } = cmd;

    await startArksServer(true, {
        port,
        host,
        protocol
    });
}