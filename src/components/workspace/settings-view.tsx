"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTheme } from "next-themes";
import {
  ME_QUERY,
  UPDATE_MY_PROFILE_MUTATION,
} from "@/graphql/operations";
import type { MeQueryResult, UpdateMyProfileResult } from "@/graphql/types";
import { useSidebar } from "@/hooks/use-sidebar";
import { ThemeToggle } from "@/components/workspace/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { collapsed, setCollapsed } = useSidebar();
  const { data, loading } = useQuery<MeQueryResult>(ME_QUERY);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [saved, setSaved] = useState(false);

  const [updateProfile, { loading: savingProfile }] =
    useMutation<UpdateMyProfileResult>(UPDATE_MY_PROFILE_MUTATION, {
      refetchQueries: [{ query: ME_QUERY }],
    });

  const me = data?.me;

  useEffect(() => {
    if (!me) return;
    setName(me.name ?? "");
    setBio(me.bio ?? "");
    setAge(me.age != null ? String(me.age) : "");
  }, [me]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({
      variables: {
        input: {
          name: name.trim() || undefined,
          bio: bio.trim() || undefined,
          age: age.trim() ? Number(age) : undefined,
        },
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSidebarDefault(checked: boolean) {
    setCollapsed(checked);
  }

  if (loading && !me) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-8 py-10">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-8 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile, appearance, and workspace preferences.
          </p>
        </header>

        <section className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold">Profile</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              How you appear in Botion.
            </p>
            <form
              onSubmit={(e) => void handleSaveProfile(e)}
              className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  value={me?.email ?? ""}
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-name">Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-bio">Bio</Label>
                <Input
                  id="settings-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short bio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-age">Age</Label>
                <Input
                  id="settings-age"
                  type="number"
                  min={0}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving…" : saved ? "Saved" : "Save profile"}
              </Button>
            </form>
          </div>

          <Separator />

          <div>
            <h2 className="text-sm font-semibold">Appearance</h2>
            <div className="mt-4 space-y-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Light, dark, or system.
                  </p>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    size="sm"
                    variant={theme === t ? "default" : "outline"}
                    onClick={() => setTheme(t)}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-sm font-semibold">Workspace</h2>
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Collapsed sidebar</p>
                  <p className="text-xs text-muted-foreground">
                    Start with the sidebar in icon-only mode.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className={cn(
                    "h-4 w-4 rounded border border-input accent-primary",
                  )}
                  checked={collapsed}
                  onChange={(e) => void handleSidebarDefault(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
