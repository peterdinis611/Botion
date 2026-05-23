"use client";

import type { ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { initApolloClient } from "@/lib/apollo-client";

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
