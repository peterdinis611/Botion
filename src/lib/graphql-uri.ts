export function getGraphqlHttpUri(): string {
  return process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql";
}

export function getGraphqlWsUri(): string {
  if (process.env.NEXT_PUBLIC_GRAPHQL_WS_URL) {
    return process.env.NEXT_PUBLIC_GRAPHQL_WS_URL;
  }
  const http = getGraphqlHttpUri();
  if (http.startsWith("https://")) {
    return http.replace("https://", "wss://");
  }
  return http.replace("http://", "ws://");
}
