import { ApolloClient, InMemoryCache } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,  // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),  // Use Apollo's in-memory cache for storing query results
});


export default client;