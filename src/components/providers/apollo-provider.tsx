"use client";

import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";
import type { ApolloClient } from "@apollo/client";
import { initApolloClient } from "@/lib/apollo-client";
import { Skeleton } from "@/components/ui/skeleton";

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ApolloClient | null>(null);

  useEffect(() => {
    let mounted = true;
    initApolloClient().then((apollo) => {
      if (mounted) setClient(apollo);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!client) {
    return (
      <div className="flex h-screen items-center justify-center gap-3 bg-background">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
