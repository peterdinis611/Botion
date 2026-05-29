import { InMemoryCache, type TypePolicies } from "@apollo/client";

export const APOLLO_CACHE_KEY = "botion-apollo-cache-v1";

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      notes: {
        keyArgs: [
          "notebookId",
          "folderId",
          "isPinned",
          "searchQuery",
          "includeArchived",
          "onlyArchived",
          "tagIds",
        ],
        merge(_existing, incoming) {
          return incoming;
        },
      },
      notebooks: {
        merge(_existing, incoming) {
          return incoming;
        },
      },
      folders: {
        merge(_existing, incoming) {
          return incoming;
        },
      },
      tags: {
        merge(_existing, incoming) {
          return incoming;
        },
      },
      notifications: {
        merge(_existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Note: {
    keyFields: ["id"],
    fields: {
      tags: {
        merge(_existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Notebook: { keyFields: ["id"] },
  Folder: { keyFields: ["id"] },
  Tag: { keyFields: ["id"] },
  Notification: { keyFields: ["id"] },
  User: { keyFields: ["id"] },
};

export function createApolloCache() {
  return new InMemoryCache({ typePolicies });
}
