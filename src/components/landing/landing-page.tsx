"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  LandingCtaSection,
  LandingFeaturesSection,
  LandingHeroSection,
  LandingHowItWorksSection,
  LandingLogosSection,
  LandingPricingSection,
  LandingSnapsSection,
  LandingWorkspacesSection,
} from "@/components/landing/landing-sections";
import { LandingHeaderDemoLink } from "@/components/landing/landing-header-demo";
import { ThemeToggle } from "@/components/workspace/theme-toggle";
import { ui } from "@/lib/ui-surface";
import { getToken } from "@/lib/auth";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Snaps", href: "#snaps" },
  { label: "Workspaces", href: "#workspaces" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  function handleGetStarted(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (isLoggedIn) {
      router.push("/workspace");
      return;
    }
    if (trimmed) {
      router.push(`/register?email=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/register");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className={ui.brandMark}>B</span>
            <span className="text-lg font-bold tracking-tight">Botion</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] text-muted-foreground md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LandingHeaderDemoLink isLoggedIn={isLoggedIn} />
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
            >
              Menu
            </button>
            <Link
              href={isLoggedIn ? "/workspace" : "/login"}
              className="rounded-lg border border-border bg-card px-4 py-2 text-[14px] font-medium shadow-sm transition-colors hover:bg-muted/50"
            >
              {isLoggedIn ? "Open workspace" : "Log in"}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-2 border-t border-border/40 px-6 py-4 md:hidden">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2 text-[15px] text-muted-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <LandingHeroSection
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleGetStarted}
          isLoggedIn={isLoggedIn}
        />
        <LandingLogosSection />
        <LandingFeaturesSection />
        <LandingSnapsSection />
        <LandingWorkspacesSection />
        <LandingHowItWorksSection />
        <LandingPricingSection />
        <LandingCtaSection />
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} Botion</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Sign up
            </Link>
            <Link href="/workspace" className="hover:text-foreground">
              Workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
