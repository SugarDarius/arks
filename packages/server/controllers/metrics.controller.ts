import { PrometheusMonitor } from '@arks/monitors';
import express from 'express';

import { MetricsService } from '../services';
import { BaseController } from './base.controller';

export class MetricsController extends BaseController {
    private _metricsService: MetricsService;

    constructor(path: string, collectTimeout: number) {
        super(path);

        this._metricsService = new MetricsService(collectTimeout);
    }

    private getMetrics(): void {
        this.router.get(this.path, (req: express.Request, res: express.Response): void => {
            res.setHeader('Content-Type', PrometheusMonitor.getRegistryContentType());
            res.status(200).send(this._metricsService.getMetrics());
        });
    }

    initilizeRoutes(): void {
        this.getMetrics();
    }
}