"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ApolloAppProvider } from "@/components/providers/apollo-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ApolloAppProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </AuthProvider>
      </ApolloAppProvider>
    </ThemeProvider>
  );
}
