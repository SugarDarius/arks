
export const reactAppClientRootTemplateFactory = (): string => {
    return `
import * as React from 'react';
import { createArksRouter } from '@arks/client';
import { hot } from 'react-hot-loader/root';

import App from '../../src/app';

function Root(): React.ReactElement {
    // TEMP - for now without Apollo GraphQL;
    const Router = createArksRouter(false);
    return (
        <Router>
            <App />
        </Router>
    );
}

export default hot(Root);
    `;
};