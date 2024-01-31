import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/YOUR_GITHUB_USER/YOUR_SUBGRAPH_NAME',
  cache: new InMemoryCache(),
});
