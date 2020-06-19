
export const reactAppClientRootTemplateFactory = (graphqlEndpoint: string): string => {
    return `
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-common';
import { createArksGraphQLClient } from '@arks/client';
import { hot } from 'react-hot-loader/root';

import App from '../../src/app';

function Root(): React.ReactElement {
    const apolloClient = createArksGraphQLClient('${graphqlEndpoint}', window.__APOLLO_STATE__ || {});
    
    return (
        <ApolloProvider client={apolloClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default hot(Root);
    `;
};