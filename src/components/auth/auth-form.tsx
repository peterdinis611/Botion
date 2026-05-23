"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/graphql/operations";

type AuthMode = "login" | "register";

type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, { loading: loginLoading }] = useMutation<{
    login: AuthResponse;
  }>(LOGIN_MUTATION);

  const [registerMutation, { loading: registerLoading }] = useMutation<{
    register: AuthResponse;
  }>(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        const { data } = await loginMutation({
          variables: { input: { email, password } },
        });
        if (!data?.login) throw new Error("Login failed");
        login(data.login.token, data.login.user);
      } else {
        const { data } = await registerMutation({
          variables: { input: { name, email, password } },
        });
        if (!data?.register) throw new Error("Registration failed");
        login(data.register.token, data.register.user);
      }
      router.push("/workspace");
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "graphQLErrors" in err &&
        Array.isArray((err as { graphQLErrors: { message: string }[] }).graphQLErrors)
          ? (err as { graphQLErrors: { message: string }[] }).graphQLErrors[0]
              ?.message
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      setError(message ?? "Something went wrong");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

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
    </div>
  );
}
