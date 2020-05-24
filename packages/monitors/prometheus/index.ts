import {
    collectDefaultMetrics,
    register,
    DefaultMetricsCollectorConfiguration
} from 'prom-client';

export class PrometheusMonitor {
    static collectDefaultMetrics(config: DefaultMetricsCollectorConfiguration): void {
       collectDefaultMetrics(config);
    }

    static stopCollectDefaultMetrics(): void {
        register.clear();
    }

    static getCollectedMetrics(): string {
        return register.metrics();
    }

    static getRegistryContentType(): string {
        return register.contentType;
    }
}