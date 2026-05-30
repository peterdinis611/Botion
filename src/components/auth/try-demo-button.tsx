"use client";

import { useMutation } from "@apollo/client/react";
import { Loader2, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { CREATE_DEMO_ACCOUNT_MUTATION } from "@/graphql/operations";
import {
  assertNoMutationError,
  getGraphQLErrorMessage,
} from "@/lib/graphql-error";
import { resetSessionExpiredHandling } from "@/lib/session-expired";
import { cn } from "@/lib/utils";

type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export function TryDemoButton({
  className,
  buttonClassName,
  variant = "outline",
  size = "default",
  showIcon = true,
  label = "Try free demo",
}: {
  className?: string;
  buttonClassName?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  label?: string;
}) {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [createDemo, { loading }] = useMutation<{
    createDemoAccount: AuthResponse;
  }>(CREATE_DEMO_ACCOUNT_MUTATION);

  async function handleClick() {
    setFormError(null);
    resetSessionExpiredHandling();
    try {
      const result = await createDemo();
      assertNoMutationError(result);
      const payload = result.data?.createDemoAccount;
      if (!payload?.token) {
        throw new Error("Could not create demo account. Please try again.");
      }
      login(payload.token, payload.user);

      const next = searchParams.get("next");
      const destination =
        next?.startsWith("/workspace") ? next : "/workspace";
      window.location.assign(destination);
    } catch (err: unknown) {
      setFormError(getGraphQLErrorMessage(err));
    }
  }

  const message = formError;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("w-full gap-2", buttonClassName)}
        disabled={loading}
        onClick={() => void handleClick()}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : showIcon ? (
          <Sparkles className="h-4 w-4" />
        ) : null}
        {loading ? "Setting up demo…" : label}
      </Button>
      {message && (
        <p className="text-center text-xs text-destructive">{message}</p>
      )}
    </div>
  );
}
