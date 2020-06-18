
import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

export type HtmlProps = {
    title: string;
    content: string;
    apolloClient: ApolloClient<NormalizedCacheObject>;
    build: string;
    publicPath: string;
    reactAppRootNodeId: string;
};

export function Html(props: HtmlProps): React.ReactElement {
    const { 
        title,
        content,
        apolloClient,
        build,
        publicPath,
        reactAppRootNodeId,
    } = props;

    return (
        <html lang="en">
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0, shrink-to-fit=no' />
                <link rel='shortcut icon' href={`${publicPath}/favicon.ico`} />

                <title>{title}</title>
            </head>
            <body>
                <div 
                    id={reactAppRootNodeId}
                    dangerouslySetInnerHTML={{
                        __html: content
                    }} 
                />
                <script
                    charSet='utf-8'
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(apolloClient.cache.extract()).replace(/</g, '\\u003c')}`
                    }}
                />
                <script src={build} />
            </body>
        </html>
    );
}