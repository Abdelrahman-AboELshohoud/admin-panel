import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
  DefaultOptions,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Authentication Link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Basic Accept headers
const basicLink = setContext(() => ({
  headers: {
    Accept: "application/json; charset=utf-8",
  },
}));

// Error Handling Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP Link
const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
});

// WebSocket Link for Subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_WS_ENDPOINT,
    connectionParams: () => ({
      authToken: localStorage.getItem("token"),
    }),
  })
);

// Split Link: Route subscriptions through wsLink and others through httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([basicLink, authLink, errorLink, httpLink])
);

// Apollo Client Instance
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
  },
  query: {
    fetchPolicy: "no-cache",
  },
};

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions,
});

export default client;
