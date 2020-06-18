
export const reactAppClientRootTemplateFactory = (graphqlEndpoint: string): string => {
    return `
import * as React from 'react';
import { ApolloProvider } from '@apollo/react-common';
import { createArksGraphQLClient, createArksRouter } from '@arks/client';
import { hot } from 'react-hot-loader/root';

import App from '../../src/app';

function Root(): React.ReactElement {
    const apolloClient = createArksGraphQLClient('${graphqlEndpoint}', window.__APOLLO_STATE__ || {});
    const Router = createArksRouter(false);
    
    return (
        <ApolloProvider client={apolloClient}>
            <Router>
                <App />
            </Router>
        </ApolloProvider>
    );
}

export default hot(Root);
    `;
};