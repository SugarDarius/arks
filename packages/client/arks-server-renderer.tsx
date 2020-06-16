import { ServerMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';

import * as path from 'path';
import * as fs from 'fs';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Html } from './dom';
import { createArksRouter } from './create-arks-router';

export type RendererOptions = {
    title: string;
    build: string;
    publicPath: string;
    reactAppRootNodeId: string;
    url: string;
    cwd: string;
    compiledServerSourceDirectoryPath: string;
    compiledAppComponentFilename: string;
};

export async function ArksReactServerRenderer(options: RendererOptions): Promise<string> {
    const { 
        url,
        cwd,
        compiledServerSourceDirectoryPath,
        compiledAppComponentFilename,
         ...rest 
    } = options;

    let AppRoot = (<div>No App component found</div>);
    const Router = createArksRouter(true, url);

    ArksServerLogger.info(ServerMessage.lookingForAppComponent);
    const isAppComponentExists: boolean = fs.existsSync(path.resolve(cwd, `${compiledServerSourceDirectoryPath}/${compiledAppComponentFilename}`));

    if (isAppComponentExists) {
        ArksServerLogger.info(ServerMessage.appComponentFound);
        try {
            const App = await import(path.resolve(cwd, `${compiledServerSourceDirectoryPath}/${compiledAppComponentFilename}`));
            console.log()
            console.log()
            console.log('App', App);
            console.log()
            console.log()
            AppRoot = (<App />);
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        ArksServerLogger.info(ServerMessage.noAppComponentFound);
    }
    ArksServerLogger.emptyLine();

    // TEMP - for now without Apollo GraphQL;
    const content: string = ReactDOMServer.renderToStaticMarkup(
        <Router>
            {AppRoot}
        </Router>
    );

    return ReactDOMServer.renderToStaticMarkup(
        <Html 
            {...rest}
            content={content}
        />
    );
}