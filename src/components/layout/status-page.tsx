import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusPage({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted shadow-sm">
        <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </div>
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
