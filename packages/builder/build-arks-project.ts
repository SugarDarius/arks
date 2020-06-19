export async function buildArksProject(): Promise<void> {
    const cwd: string = process.cwd();
    process.env.NODE_ENV = 'production';
}