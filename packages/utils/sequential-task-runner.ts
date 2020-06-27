import { isUndefined } from './is';

export type SequentialTaskRunnerTask = {
    action: () => Promise<boolean>;
    onStart?: () => void;
    onSuccess?: () => void;
    onFail?: () => void;
}; 

export async function sequentialTaskRunner(
    tasks: SequentialTaskRunnerTask[],
    onSequenceStop: () => void,
    onSequenceEnd: () => void, 
): Promise<void> {
    const runner = async (tasks: SequentialTaskRunnerTask[], index: number = 0): Promise<void> => {
        const task = tasks[index];

        if (!isUndefined(task)) {
            !!task.onStart && task.onStart();
            const success = await task.action();

            if (success) {
                !!task.onSuccess && task.onSuccess();
                await runner(tasks, ++index);
            }
            else {
                !!task.onFail && task.onFail();
                onSequenceStop();
            }
        }
        else {
            onSequenceEnd();
        }
    };

    await runner(tasks);
}