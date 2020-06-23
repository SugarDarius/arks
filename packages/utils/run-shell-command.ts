import { spawn } from 'child_process';

export type RunShellCommandPromiseReturnType = {
    success: boolean;
};

export type RunShellCommandOptions = {
    command: string;
    args: string[];
    cwd: string;
    logger: { 
        info: (message: string) => void;
        error: (message: string) => void;
    }
};

export async function runShellCommand(options: RunShellCommandOptions): Promise<RunShellCommandPromiseReturnType> {
    const { command, args, cwd, logger } = options;
    
    const childProcess = spawn(command, args, {
        cwd,
        stdio: 'pipe',
        shell: true,
    });

    childProcess.stdout.on('data', (data) => {
        logger.info(data.toString());
    });

    childProcess.stderr.on('data', (data) => {
        logger.error(data.toString());
    });

    return new Promise<RunShellCommandPromiseReturnType>((resolve) => {
        childProcess.on('close', (code: number): void => {
            resolve({ success: code === 0 });
        });
    });
}