import { ApolloClient, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist";
import { createClient } from "graphql-ws";
import { getToken } from "./auth";
import { APOLLO_CACHE_KEY, createApolloCache } from "./apollo-cache";
import { getGraphqlHttpUri, getGraphqlWsUri } from "./graphql-uri";

export async function initApolloClient() {
  const cache = createApolloCache();

  if (typeof window !== "undefined") {
    await persistCache({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
      key: APOLLO_CACHE_KEY,
      maxSize: 5 * 1024 * 1024,
      trigger: "write",
      debounce: 500,
    });
  }

  const httpLink = new HttpLink({ uri: getGraphqlHttpUri() });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: getGraphqlWsUri(),
            connectionParams: () => {
              const token = getToken();
              return token ? { authorization: `Bearer ${token}` } : {};
            },
            retryAttempts: 5,
            shouldRetry: () => true,
          }),
        )
      : null;

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink),
      )
    : authLink.concat(httpLink);

  return new ApolloClient({
    link: splitLink,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-first",
      },
    },
  });
}
