import { setContext } from "@apollo/client/link/context";
import { getToken } from "@/lib/auth";

/** Do not attach stale JWT to login/register — it can break auth mutations. */
const PUBLIC_OPERATIONS = new Set(["Login", "Register"]);

export const authLink = setContext((operation, prev) => {
  const { headers = {} } = prev;

  if (PUBLIC_OPERATIONS.has(operation.operationName ?? "")) {
    return { headers };
  }

  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});
