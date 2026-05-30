"use client";

import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { PasswordInput } from "@/components/auth/password-input";
import { TryDemoButton } from "@/components/auth/try-demo-button";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/graphql/operations";
import {
  assertNoMutationError,
  getGraphQLErrorMessage,
} from "@/lib/graphql-error";
import { clearAuth, getToken } from "@/lib/auth";
import { resetSessionExpiredHandling } from "@/lib/session-expired";
import { consumeSessionExpiredFlash } from "@/lib/session-flash";

type AuthMode = "login" | "register";

type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    resetSessionExpiredHandling();

    if (consumeSessionExpiredFlash()) {
      clearAuth();
      setInfoMessage("Your session expired. Please sign in again.");
    } else if (getToken()) {
      const next = searchParams.get("next");
      const destination =
        next?.startsWith("/workspace") ? next : "/workspace";
      window.location.replace(destination);
      return;
    }

    const prefill = searchParams.get("email");
    if (prefill) setEmail(prefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const [loginMutation, { loading: loginLoading }] = useMutation<{
    login: AuthResponse;
  }>(LOGIN_MUTATION);

  const [registerMutation, { loading: registerLoading }] = useMutation<{
    register: AuthResponse;
  }>(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);
    resetSessionExpiredHandling();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setFormError("Enter your email address.");
      return;
    }

    try {
      if (mode === "login") {
        const result = await loginMutation({
          variables: { input: { email: trimmedEmail, password } },
        });
        assertNoMutationError(result);
        if (!result.data?.login?.token) {
          throw new Error("Login failed. Please try again.");
        }
        login(result.data.login.token, result.data.login.user);
      } else {
        const result = await registerMutation({
          variables: {
            input: { name: name.trim(), email: trimmedEmail, password },
          },
        });
        assertNoMutationError(result);
        if (!result.data?.register?.token) {
          throw new Error("Registration failed. Please try again.");
        }
        login(result.data.register.token, result.data.register.user);
      }

      const next = searchParams.get("next");
      const destination =
        next?.startsWith("/workspace") ? next : "/workspace";
      window.location.assign(destination);
    } catch (err: unknown) {
      setFormError(getGraphQLErrorMessage(err));
    }
  }

  const displayError = formError;

  return (
    <FadeIn className="w-full max-w-sm space-y-6" variant="scale">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {mode === "login" ? "Welcome back" : "Create your workspace"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to continue to Botion"
            : "Start organizing notes like Notion"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              minLength={2}
              autoComplete="name"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters</p>
        </div>

        {infoMessage && !displayError && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {infoMessage}
          </p>
        )}

        {displayError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {displayError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Suspense fallback={null}>
        <TryDemoButton label="Continue with free demo" />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </FadeIn>
  );
}
