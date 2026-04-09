import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    headers: {
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
});
