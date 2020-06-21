export type TProcessMessage = {
    exiting: string;
    uptime: (time: number) => string;
};

export const ProcessMessage: TProcessMessage = {
    exiting: `Exiting NodeJS process pid:${process.pid} with exit code 1!`,
    uptime: (time: number): string => {
        return `NodeJS process pid:${process.pid} was up since ${Math.floor(time)}s!`;
    },
};