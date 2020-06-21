import { startArksServer } from '@arks/server';

export async function StartCommand(cmd: any): Promise<void> {
    const { 
        port, 
        host, 
        protocol,
        open,
    } = cmd;

    await startArksServer(false, {
        port,
        host,
        protocol,
        openWebrowser: open,
    });
}