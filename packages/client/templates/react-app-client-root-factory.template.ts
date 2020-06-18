
export const reactAppClientRootTemplateFactory = (): string => {
    return `
import * as React from 'react';
import { createArksRouter } from '@arks/client';

import App from '../../src/app';

export function Root(): React.ReactElement {
    // TEMP - for now without Apollo GraphQL;
    const Router = createArksRouter(false);
    return (
        <Router>
            <App />
        </Router>
    );
}
    `;
};