
import express from 'express';

import { LivenessService } from '../services';
import { BaseController } from './base.controller';

export class LivenessController extends BaseController {
    private _livenessService: LivenessService;

    constructor(path: string) {
        super(path);

        this._livenessService = new LivenessService();
        this.initilizeRoutes();
    }

    private getAlive(): void {
        this.router.get(this.path, (req: express.Request, res: express.Response): void => {
            res.status(200).send(this._livenessService.getAlive());
        });
    }

    initilizeRoutes(): void {
        this.getAlive();
    }
}