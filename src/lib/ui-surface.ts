/** Shared surface + layout classes for the Botion design system. */
export const ui = {
  appShell: "flex h-screen overflow-hidden bg-background",
  canvas: "flex min-h-0 min-w-0 flex-1 flex-col bg-canvas",
  sidebar:
    "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out",
  sidebarExpanded: "w-60",
  sidebarCollapsed: "w-14",
  panel:
    "relative flex h-full w-[300px] shrink-0 flex-col border-l border-panel-border bg-panel",
  header:
    "flex shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-5 py-2.5 backdrop-blur-md",
  sectionLabel:
    "px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80",
  navItem:
    "group/nav relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all duration-150",
  navItemActive:
    "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm",
  navItemIdle:
    "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
  card: "rounded-2xl border border-border/60 bg-card shadow-sm",
  cardMuted: "rounded-2xl border border-border/40 bg-muted/30",
  pageContainer: "mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-6 py-8 pb-20 sm:px-8 sm:py-10",
  brandMark:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm",
} as const;
