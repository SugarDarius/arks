
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Html } from './dom';

export type RendererOptions = {
    title: string;
    content: string;
    build: string;
    publicPath: string;
};

export async function ArksReactServerRenderer(options: RendererOptions): Promise<string> {
    const { ...rest } = options;
    return ReactDOMServer.renderToStaticMarkup(<Html {...rest}  />);
}