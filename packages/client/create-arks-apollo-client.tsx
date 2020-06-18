import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { fetch } from 'apollo-env';

export function createArksGraphQLClient(url: string, initialState: NormalizedCacheObject, ssr?: boolean): ApolloClient<NormalizedCacheObject> {
    return new ApolloClient<NormalizedCacheObject>({
       ...( ssr ? { } : { ssrForceFetchDelay: 200 }),
       ssrMode: ssr,
       cache: ssr ? new InMemoryCache() : new InMemoryCache().restore(initialState),
       link: createHttpLink({
           // @ts-ignore
           fetch: fetch,
           uri: url,
           credentials: 'same-origin'
       }),
    });
}