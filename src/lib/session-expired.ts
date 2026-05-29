import type { ApolloClient } from "@apollo/client";
import type { ErrorLike } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { clearAuth, getToken } from "@/lib/auth";
import {
  isWithinLoginGracePeriod,
  markSessionExpiredFlash,
} from "@/lib/session-flash";

let apolloClient: ApolloClient | null = null;
let handling = false;

function isInvalidOrExpiredTokenMessage(message: string): boolean {
  return message.toLowerCase().includes("invalid or expired token");
}

function isMissingAuthHeaderMessage(message: string): boolean {
  return message.toLowerCase().includes("authorization header is missing");
}

function messageIndicatesSessionExpired(message: string): boolean {
  if (isInvalidOrExpiredTokenMessage(message)) {
    return true;
  }
  if (isMissingAuthHeaderMessage(message)) {
    return !getToken();
  }
  return false;
}

export function registerApolloClient(client: ApolloClient) {
  apolloClient = client;
}

export function resetSessionExpiredHandling() {
  handling = false;
}

export function isAuthError(error: ErrorLike): boolean {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some((e) => messageIndicatesSessionExpired(e.message));
  }
  if (error instanceof Error) {
    return messageIndicatesSessionExpired(error.message);
  }
  return false;
}

function isPublicAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path === "/login" || path === "/register";
}

export function shouldHandleSessionExpired(operationName?: string): boolean {
  if (isWithinLoginGracePeriod()) return false;
  if (operationName === "Login" || operationName === "Register") {
    return false;
  }
  if (isPublicAuthRoute()) {
    return false;
  }
  return true;
}

export function handleSessionExpired() {
  if (
    typeof window === "undefined" ||
    handling ||
    isPublicAuthRoute() ||
    isWithinLoginGracePeriod()
  ) {
    return;
  }

  handling = true;

  clearAuth();
  markSessionExpiredFlash();

  const next = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  const loginUrl =
    window.location.pathname.startsWith("/workspace") && next
      ? `/login?next=${next}`
      : "/login";

  const redirect = () => {
    handling = false;
    window.location.assign(loginUrl);
  };

  if (apolloClient) {
    void apolloClient.clearStore().finally(redirect);
  } else {
    redirect();
  }
}
