
import express from 'express';

export function unlessMiddleware(
    pathToExclude: RegExp,
    middleware: express.RequestHandler,
): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        pathToExclude.exec(req.path) ? next() : middleware(req, res, next);
    };
}