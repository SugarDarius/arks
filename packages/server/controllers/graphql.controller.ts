

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { BaseController } from './base.controller';

export class GraphQLController extends BaseController {
    private _target: string;
  
    constructor(path: string, target: string) {
        super(path);

        this._target = target;
        this.initilizeRoutes();
    }

    initilizeRoutes(): void {
        this.router.use(
            this.path, 
            this._target.length > 0 ? 
            createProxyMiddleware({
                target: this._target,
                changeOrigin: true,
                ws: true,
                pathRewrite: async (path: string): Promise<string> => {
                    return path.replace(this.path, '');
                }
            }) : (req: express.Request, res: express.Response): void => {
                res.status(200).send({ });
            }
        );
    }
}