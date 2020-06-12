
import { PrometheusMonitor } from '@arks/monitors';

export class MetricsService {
    constructor(collectTimeout: number) {
        PrometheusMonitor.collectDefaultMetrics({
            eventLoopMonitoringPrecision: collectTimeout,
        });
    }

    getMetrics(): string {
        return PrometheusMonitor.getCollectedMetrics();
    }
}