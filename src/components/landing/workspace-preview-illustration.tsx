export function WorkspacePreviewIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 280" fill="none" className={className} aria-hidden>
      <rect x="0" y="0" width="120" height="280" fill="var(--sidebar)" />
      <rect x="120" y="0" width="240" height="280" fill="var(--landing-illust-surface)" />
      <line x1="120" y1="0" x2="120" y2="280" stroke="var(--landing-illust-border)" />
      <text x="16" y="28" fill="var(--muted-foreground)" fontSize="10" fontWeight="600">
        WORKSPACE
      </text>
      <rect x="12" y="40" width="96" height="28" rx="6" fill="var(--sidebar-accent)" />
      <text x="24" y="58" fill="var(--foreground)" fontSize="12">
        🎯 Acme Inc.
      </text>
      <rect x="12" y="76" width="96" height="28" rx="6" fill="var(--landing-illust-accent)" />
      <text x="24" y="94" fill="var(--foreground)" fontSize="12">
        📘 Research
      </text>
      <text x="16" y="128" fill="var(--muted-foreground)" fontSize="10" fontWeight="600">
        TAGS
      </text>
      <rect x="12" y="140" width="72" height="20" rx="4" fill="var(--tag)" fillOpacity="0.25" />
      <text x="20" y="154" fill="var(--tag-foreground)" fontSize="11">
        #ideas
      </text>
      <rect x="140" y="24" width="180" height="12" rx="4" fill="var(--landing-illust-muted)" />
      <rect x="140" y="48" width="140" height="10" rx="3" fill="var(--landing-illust-muted)" />
      <rect x="140" y="68" width="200" height="10" rx="3" fill="var(--landing-illust-muted)" />
      <rect x="140" y="88" width="160" height="10" rx="3" fill="var(--landing-illust-muted)" />
    </svg>
  );
}
