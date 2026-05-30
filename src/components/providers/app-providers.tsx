"use client";

import { MotionProvider } from "@/components/motion/motion-provider";
import { ApolloAppProvider } from "@/components/providers/apollo-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <ApolloAppProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={300}>
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ApolloAppProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
