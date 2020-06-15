
import * as React from 'react';

export type HtmlProps = {
    title: string;
    content: string;
    build: string;
    publicPath: string;
    reactAppRootNodeId: string;
};

export function Html(props: HtmlProps): React.ReactElement {
    const { 
        title,
        content,
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
                <script src={build} />
            </body>
        </html>
    );
}