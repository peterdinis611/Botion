import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BotionBrandLink({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background transition-transform group-hover:scale-105">
        B
      </span>
      <span className="font-medium tracking-tight">Botion</span>
    </Link>
  );
}

export function StatusPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden bg-background",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--landing-blob-2),transparent)] opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[var(--landing-blob-1)] opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-1/4 h-64 w-64 rounded-full bg-[var(--landing-blob-3)] opacity-30 blur-3xl"
      />

      <header className="relative z-10 px-6 py-6">
        <BotionBrandLink />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16">
        {children}
      </main>
    </div>
  );
}

export function StatusPage({
  code,
  icon: Icon,
  title,
  description,
  hint,
  children,
  footer,
  className,
}: {
  code?: string | number;
  icon: LucideIcon;
  title: string;
  description: string;
  hint?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <StatusPageShell className={className}>
      <div className="w-full max-w-md text-center">
        {code !== undefined && (
          <p className="font-mono text-sm font-medium tracking-widest text-muted-foreground/70">
            {code}
          </p>
        )}

        <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {hint && (
          <p className="mt-3 text-xs text-muted-foreground/80">{hint}</p>
        )}

        {children && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        )}

        {footer && <div className="mt-6 w-full">{footer}</div>}
      </div>
    </StatusPageShell>
  );
}

export function StatusPageLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-background hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}
