export type TCreatorMessage = {
    startCreatingProject: string;
    projectCreated: string;
    projectCreationError: string;
    projectCreationStopped: string;
    creationTotaltime: (seconds: number) => string;

    directoryWithProjectNameAlreadyExists: (name: string) => string;
    projectionCreationAborted: string;
    creatingProjectDirectory: string;
    projectDirectoryCreated: string;
    projectDirectoryCreationError: string;
};

export const CreatorMessage: TCreatorMessage = {
    startCreatingProject: `Starting creating project!`,
    projectCreated: `Project created!`,
    projectCreationError: `Error while creating project!`,
    projectCreationStopped: `Project creation is stopped!`,
    creationTotaltime: (seconds: number): string => {
        return `Project creation took ${seconds}s!`;
    },

    directoryWithProjectNameAlreadyExists: (name: string): string => {
        return `Cannot create project with name <${name}> because a directory with the same name alreadys exists!`;
    },
    projectionCreationAborted: `Project creation aborted!`,
    creatingProjectDirectory: `Creating project directory!`,
    projectDirectoryCreated: `Project directory created!`,
    projectDirectoryCreationError: `Error while creating project directory!`,
};