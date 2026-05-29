import { CombinedGraphQLErrors } from "@apollo/client/errors";

type MutateLikeResult = {
  error?: unknown;
  errors?: readonly { message: string }[];
};

export function getGraphQLErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const first = error.errors[0]?.message;
    if (first) return first;
    return error.message;
  }

  const withErrors = error as MutateLikeResult;
  if (withErrors?.error) {
    return getGraphQLErrorMessage(withErrors.error);
  }
  if (withErrors?.errors?.[0]?.message) {
    return withErrors.errors[0].message;
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Cannot reach the server. Start the backend: cd botion/backend && pnpm start:dev";
  }
  if (error instanceof Error && error.message) {
    if (error.message.includes("Failed to fetch")) {
      return "Cannot reach the server. Start the backend on port 3000.";
    }
    return error.message;
  }
  return "Something went wrong. Check that the server is running.";
}

/** Apollo Client 4 mutate() returns { data, error } and does not always throw. */
export function assertNoMutationError<T>(result: {
  data?: T;
  error?: unknown;
}): asserts result is { data: T } {
  if (result.error) {
    throw result.error;
  }
}
