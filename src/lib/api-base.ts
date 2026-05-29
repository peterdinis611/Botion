export function getApiBaseUrl(): string {
  const graphql = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql";
  return graphql.replace(/\/graphql\/?$/, "");
}

export function getFileUrl(fileId: string): string {
  return `${getApiBaseUrl()}/files/${fileId}`;
}
