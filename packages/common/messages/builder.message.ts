export type TBuilderMessage = {
    startBuildingProject: string;
    projectBuilded: string;
    buildProjectError: string;
    buildStopped: string;

    creatingServerArksWebpackCompiler: string;
    serverArksWebpackCompilerCreated: string;
    arksServerWebpackCompilerCreationError: string;
    compilingReactAppForServerSideRendering: string;
    reactAppCompilationForServerSideRenderingSuccess: string;
    reactAppCompilationForServerSideRenderingError: string;

    creatingClientArksWebpackCompiler: string;
    clientArksWebpackCompilerCreated: string;
    arksClientWebpackCompilerCreationError: string;
    compilingReactAppForClientSideRendering: string;
    reactAppCompilationForClientSideRenderingSuccess: string;
    reactAppCompilationForClientSideRenderingError: string;

    lookingForReactAppClientEntry: string;
    reactAppClientEntryFound: string;
    noReactAppClientEntryFound: string;
};

export const BuilderMessage: TBuilderMessage = {
    startBuildingProject: `Starting building project!`,
    projectBuilded: `Project builed!`,
    buildProjectError: `Error while building project!`,
    buildStopped: `Project building is stopped!`,

    creatingServerArksWebpackCompiler: `Creating server Arks webpack compiler!`,
    serverArksWebpackCompilerCreated: `Server Arks webpack compiler create!`,
    arksServerWebpackCompilerCreationError: `Server Arks webpack compiler creation error`,
    compilingReactAppForServerSideRendering: `Compiling React app for server side rendering`,
    reactAppCompilationForServerSideRenderingSuccess: `React app compilation for server side rendering success`,
    reactAppCompilationForServerSideRenderingError: `React app compilation for server side rendering error`,

    creatingClientArksWebpackCompiler: `Creating client Arks webpack compiler!`,
    clientArksWebpackCompilerCreated: `Client Arks webpack compiler create!`,
    arksClientWebpackCompilerCreationError: `Client Arks webpack compiler creation error`,
    compilingReactAppForClientSideRendering: `Compiling React app for client side rendering`,
    reactAppCompilationForClientSideRenderingSuccess: `React app compilation for server side rendering success`,
    reactAppCompilationForClientSideRenderingError: `React app compilation for client side rendering error`,

    lookingForReactAppClientEntry: `Looking for React app client entry`,
    reactAppClientEntryFound: `React app client entry found!`,
    noReactAppClientEntryFound: `No React app client entry found!`,
};