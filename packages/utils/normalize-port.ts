
export function normalizePort(value: string, fallback: number): number {
    const port: number = parseInt(value, 10);

    return isNaN(port) ? fallback : port;
}