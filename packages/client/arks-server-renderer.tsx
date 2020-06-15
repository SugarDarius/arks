
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
    sourceDirectoryPath: string;
    appComponentFilename: string;
};

export async function ArksReactServerRenderer(options: RendererOptions): Promise<string> {
    const { 
        url,
        cwd,
        sourceDirectoryPath,
        appComponentFilename,
         ...rest 
    } = options;

    const fallbackDiv = (<div />);
    const Router = createArksRouter(true, url);

    // Read APP component

    // TEMP - for now without Apollo GraphQL;
    const content: string = ReactDOMServer.renderToStaticMarkup(
        <Router>
            <div />
        </Router>
    );

    return ReactDOMServer.renderToStaticMarkup(
        <Html 
            {...rest}
            content={content}
        />
    );
}