import { ServerMessage } from '@arks/common';
import { ArksServerLogger } from '@arks/logger';

import { ApolloProvider } from '@apollo/react-common';
import { renderToStringWithData } from '@apollo/react-ssr';

import * as path from 'path';
import * as fs from 'fs';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Html } from './dom';
import { createArksGraphQLClient } from './create-arks-apollo-client';
import { createArksRouter } from './create-arks-router';

export type RendererOptions = {
    title: string;
    build: string;
    publicPath: string;
    reactAppRootNodeId: string;
    internalGraphQLEndpoint: string;
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
        internalGraphQLEndpoint,
         ...rest 
    } = options;

    let app = (<div>No App component found</div>);

    ArksServerLogger.info(ServerMessage.lookingForAppComponent);
    const isAppComponentExists: boolean = fs.existsSync(path.resolve(cwd, `${compiledServerSourceDirectoryPath}/${compiledAppComponentFilename}`));

    if (isAppComponentExists) {
        ArksServerLogger.info(ServerMessage.appComponentFound);
        try {
            ArksServerLogger.info(ServerMessage.importingAppComponent);
            const { default: App } = await import(path.resolve(cwd, `${compiledServerSourceDirectoryPath}/${compiledAppComponentFilename}`));
            
            ArksServerLogger.info(ServerMessage.appComponentImportSuccess);
            app = (<App />);
        }
        catch (err) {
            ArksServerLogger.info(ServerMessage.appComponentImportError);
            ArksServerLogger.error(err.message || err, err.stack);
        }
    }
    else {
        ArksServerLogger.info(ServerMessage.noAppComponentFound);
    }
    
    ArksServerLogger.emptyLine();

    const apolloclient = createArksGraphQLClient(internalGraphQLEndpoint, {}, true);
    const Router = createArksRouter(true, url);

    let content = '';
    try {
        content = await renderToStringWithData((
            <ApolloProvider client={apolloclient}>
                <Router>
                    {app}
                </Router>
            </ApolloProvider>
        ));
    }
    catch (err) {
        ArksServerLogger.error(err.message || err, err.stack);
    }

    return ReactDOMServer.renderToString(
        <Html 
            {...rest}
            apolloClient={apolloclient}
            content={content}
        />
    );
}