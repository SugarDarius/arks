
import { generateUUID } from '@arks/utils';
import express from 'express';

export function durationMiddleware (
    onStart: (path: string, method: string, uuid: string) => void,
    onFinish: (path: string, method: string, uuid: string, duration: number, statusCode: number) => void,
    onError: (path: string, method: string, uuid: string, error: Error, statusCode: number) => void,
): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const uuid = generateUUID();
        const startHrTime = process.hrtime();

        const { path, method } = req;
        
        onStart(path, method, uuid);

        res.on('finish', (): void => {
            const elapsedHrTime = process.hrtime(startHrTime);
            const elaposedHrTimeMs = elapsedHrTime[0] * 1e9 + elapsedHrTime[1];

            onFinish(path, method, uuid, elaposedHrTimeMs, res.statusCode)
        });

        res.on('error', (error: Error): void => {
            onError(path, method, uuid, error, res.statusCode);
        });
    };
}