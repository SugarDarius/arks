import * as React from 'react';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

export function createArksRouter(ssr: boolean, url?: string): React.FC {
    let RRRouter: any = null;
    let rrRouterProps = {};

    if (ssr && !!url) {
        RRRouter = StaticRouter
        rrRouterProps = { location: url, context: { }};
    }
    else {
        RRRouter = BrowserRouter;
    }

    return function Router(props): React.ReactElement {
        const { children } = props;

        return (
            <RRRouter {...rrRouterProps}>
                {children}
            </RRRouter>
        );
    }
}