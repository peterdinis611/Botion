import { ApolloClient, HttpLink, split } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist";
import { createClient } from "graphql-ws";
import { APOLLO_CACHE_KEY, createApolloCache } from "./apollo-cache";
import { authLink } from "./apollo-auth-link";
import { getToken } from "./auth";
import { getGraphqlHttpUri, getGraphqlWsUri } from "./graphql-uri";
import {
  handleSessionExpired,
  isAuthError,
  registerApolloClient,
  shouldHandleSessionExpired,
} from "./session-expired";

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

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: getGraphqlWsUri(),
            lazy: true,
            connectionParams: () => {
              const token = getToken();
              if (!token) {
                return {};
              }
              return { authorization: `Bearer ${token}` };
            },
            retryAttempts: 5,
            shouldRetry: () => {
              return Boolean(getToken());
            },
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

  const errorLink = new ErrorLink(({ error, operation }) => {
    if (
      isAuthError(error) &&
      shouldHandleSessionExpired(operation.operationName)
    ) {
      handleSessionExpired();
    }
  });

  const client = new ApolloClient({
    link: errorLink.concat(splitLink),
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

  registerApolloClient(client);
  return client;
}
