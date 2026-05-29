import type { FormEvent } from "react";
import {
  Camera,
  Check,
  FileText,
  FolderKanban,
  LayoutGrid,
  Share2,
  Sparkles,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import { SnapsPreviewIllustration } from "@/components/landing/snaps-preview-illustration";
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
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Notes, Snaps & workspaces in one tool
        </p>
        <h1 className="text-[2.75rem] font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
          All-in-one
          <br />
          workspace
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
          Write, plan, and capture ideas with pages, tags, and a Snaps panel beside
          your doc. Botion keeps research and writing in one calm place.
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
            className="h-12 flex-1 rounded-lg border border-border bg-card px-3 text-base text-foreground shadow-sm outline-none ring-primary/30 focus:ring-2"
            autoComplete="email"
          />
          <Button
            type="submit"
            className={cn(
              "h-12 shrink-0 rounded-lg px-6 text-base font-medium text-white shadow-sm",
              "bg-landing-accent hover:bg-landing-accent-hover",
            )}
          >
            {isLoggedIn ? "Go to workspace" : "Get started"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          For teams & individuals — Web, Mac, Windows (web app today).
        </p>
      </div>

      <div className="relative flex justify-center md:justify-end">
        <HeroIllustration className="h-auto w-full max-w-[520px]" />
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
      icon: Camera,
      title: "Snaps panel",
      description: "Paste or drop screenshots next to your page. Zoom, caption, and organise visual references.",
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

export function LandingSnapsSection() {
  return (
    <section id="snaps" className="border-t border-border/60 bg-card py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        <SnapsPreviewIllustration className="order-2 md:order-1 h-auto w-full max-w-md justify-self-center" />
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Snaps stay beside your writing
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Collect UI captures, photos, and references in a dedicated panel. Paste
            from the clipboard or drag files — no more lost screenshots in Downloads.
          </p>
          <ul className="mt-6 space-y-3">
            {["Paste & drag-drop upload", "Per-notebook or per-page scope", "Compact cards & captions"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 text-[15px]">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ),
            )}
          </ul>
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
    { step: "3", title: "Add Snaps as you go", text: "Drop visuals into the side panel while you research." },
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
              {["Unlimited pages", "Snaps panel", "Workspaces & tags"].map((f) => (
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
