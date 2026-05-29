export function SnapsPreviewIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 280" fill="none" className={className} aria-hidden>
      <rect
        x="0"
        y="0"
        width="360"
        height="280"
        rx="16"
        fill="var(--landing-illust-panel)"
        stroke="var(--landing-illust-border)"
      />
      <text x="20" y="32" fill="var(--foreground)" fontSize="14" fontWeight="600">
        Snaps
      </text>
      <rect
        x="20"
        y="48"
        width="320"
        height="100"
        rx="8"
        fill="var(--landing-illust-accent)"
        stroke="var(--primary)"
        strokeOpacity="0.35"
      />
      <rect
        x="28"
        y="56"
        width="120"
        height="12"
        rx="4"
        fill="var(--landing-illust-surface)"
        opacity="0.85"
      />
      <rect
        x="28"
        y="72"
        width="200"
        height="8"
        rx="3"
        fill="var(--landing-illust-surface)"
        opacity="0.5"
      />
      <rect
        x="20"
        y="160"
        width="150"
        height="90"
        rx="8"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
      />
      <rect
        x="182"
        y="160"
        width="158"
        height="90"
        rx="8"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
      />
      <circle cx="330" cy="24" r="14" fill="var(--primary)" opacity="0.2" />
      <text x="322" y="28" fill="var(--primary)" fontSize="16" fontWeight="bold">
        +
      </text>
    </svg>
  );
}
