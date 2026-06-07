import type { FormEvent } from "react";
import {
  CalendarDays,
  Check,
  FileText,
  FolderKanban,
  LayoutGrid,
  Network,
  Share2,
  Sparkles,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import { LandingCtaDemo } from "@/components/landing/landing-cta-demo";
import { LandingDemoCta } from "@/components/landing/landing-demo-cta";
import { LandingPricingDemo } from "@/components/landing/landing-pricing-demo";
import { WorkspacePreviewIllustration } from "@/components/landing/workspace-preview-illustration";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeroSection({
  email,
  onEmailChange,
  onSubmit,
  isLoggedIn,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoggedIn: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-6 md:grid-cols-2 md:items-center md:gap-8 md:px-10 md:pt-12 lg:gap-16">
      <div className="max-w-xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent/60 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Notes, graphs & calm workspaces
        </p>
        <h1 className="text-[2.75rem] font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-[3.35rem]">
          Think clearly.
          <br />
          <span className="text-primary">Work in one place.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
          Botion blends writing, planning, and visual thinking — without feeling
          like a clone of everything else.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 flex-1 rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm outline-none ring-primary/30 focus:ring-2"
            autoComplete="email"
          />
          <Button
            type="submit"
            className={cn(
              "h-12 shrink-0 rounded-xl px-6 text-base font-semibold text-white shadow-sm",
              "bg-landing-accent hover:bg-landing-accent-hover",
            )}
          >
            {isLoggedIn ? "Go to workspace" : "Get started"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          For teams & individuals — Web, Mac, Windows (web app today).
        </p>
        <LandingDemoCta isLoggedIn={isLoggedIn} />
      </div>

      <div className="relative flex justify-center md:justify-end">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(100%,420px)] w-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,var(--landing-blob-2),transparent_70%)] opacity-50 blur-2xl"
        />
        <HeroIllustration className="hero-illustration-float relative h-auto w-full max-w-[600px]" />
      </div>
    </section>
  );
}

export function LandingLogosSection() {
  const labels = ["Product teams", "Founders", "Researchers", "Agencies", "Students"];
  return (
    <section className="border-y border-border/50 bg-card/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-sm font-medium text-muted-foreground md:px-10">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}

export function LandingFeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Block editor",
      description: "Write in a clean editor with titles, tags, and autosave — like Notion, tuned for focus.",
    },
    {
      icon: Network,
      title: "Graph canvas",
      description: "Map ideas, flows, and connections on a visual canvas linked to your pages.",
    },
    {
      icon: FolderKanban,
      title: "Workspaces",
      description: "Notebooks per client or project. Filter by tags and open the right context in one click.",
    },
    {
      icon: Tags,
      title: "Workspace tags",
      description: "Tag pages per notebook, filter the sidebar, and keep hashtags meaningful — not decorative.",
    },
    {
      icon: Share2,
      title: "Share & invite",
      description: "Share links and invite teammates to a workspace (collaboration flows are growing).",
    },
    {
      icon: LayoutGrid,
      title: "Calendar & graphs",
      description: "Plan in calendar view and connect ideas in graph view when you need the bigger picture.",
    },
  ];

  return (
    <section id="features" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to think in one place
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Botion combines writing, visual references, and workspace structure so you
            stop juggling tabs.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingWorkspacesSection() {
  return (
    <section id="workspaces" className="border-t border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            A workspace for every project
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Create notebooks for clients, courses, or side projects. Tags and filters
            in the sidebar help you jump back into the right headspace instantly.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Flat workspace list with emoji icons",
              "Tags per notebook + quick filters",
              "New page in one click from the sidebar",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px]">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <WorkspacePreviewIllustration className="h-auto w-full max-w-md justify-self-center" />
      </div>
    </section>
  );
}

export function LandingHowItWorksSection() {
  const steps = [
    { step: "1", title: "Create a workspace", text: "Name a notebook for your project — Acme, Thesis, Personal." },
    { step: "2", title: "Write your first page", text: "Open the block editor, add tags, and start drafting." },
    { step: "3", title: "Plan on the calendar", text: "Schedule work and keep important pages within reach." },
  ];

  return (
    <section className="border-t border-border/60 bg-card py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Up and running in minutes
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, text }) => (
            <div key={step} className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-tag-foreground"
                style={{ backgroundColor: "var(--landing-step-bg)" }}
              >
                {step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPricingSection() {
  return (
    <section id="pricing" className="border-t border-border/60 bg-background py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Botion is free while we&apos;re in active development.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Personal</p>
            <p className="mt-2 text-4xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-6 space-y-2 text-[15px]">
              {["Unlimited pages", "Graphs & calendar", "Workspaces & tags"].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-8 block">
              <Button className="w-full bg-landing-accent text-white hover:bg-landing-accent-hover">
                Get started free
              </Button>
            </Link>
            <div className="mt-3">
              <LandingPricingDemo />
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8">
            <p className="text-sm font-medium text-muted-foreground">Team</p>
            <p className="mt-2 text-4xl font-bold">Soon</p>
            <p className="text-sm text-muted-foreground">shared workspaces</p>
            <ul className="mt-6 space-y-2 text-[15px] text-muted-foreground">
              {["Invite members", "Shared tags", "Admin controls"].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingCtaSection() {
  return (
    <section className="border-t border-border/60 bg-foreground py-16 text-background">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-3xl font-bold tracking-tight">Ready to try Botion?</h2>
        <p className="mt-3 text-lg opacity-80">
          Create an account in under a minute. Your workspace is waiting.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-landing-accent text-white hover:bg-landing-accent-hover"
            >
              Create free account
            </Button>
          </Link>
          <LandingCtaDemo />
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-background/30 bg-transparent text-background hover:bg-background/10"
            >
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
