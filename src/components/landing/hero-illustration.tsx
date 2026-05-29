/** Original workspace illustration for Botion landing (theme-aware via CSS vars). */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="380" cy="120" rx="140" ry="100" fill="var(--landing-blob-1)" opacity="0.9" />
      <ellipse cx="120" cy="320" rx="100" ry="70" fill="var(--landing-blob-2)" opacity="0.8" />
      <ellipse cx="420" cy="340" rx="80" ry="55" fill="var(--landing-blob-3)" opacity="0.7" />

      <rect x="88" y="248" width="200" height="8" rx="4" fill="var(--landing-illust-border)" />
      <rect x="72" y="256" width="232" height="12" rx="2" fill="var(--foreground)" opacity="0.12" />

      <rect
        x="200"
        y="108"
        width="220"
        height="150"
        rx="10"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
        strokeWidth="2"
      />
      <rect x="212" y="120" width="196" height="14" rx="4" fill="var(--landing-illust-accent)" />
      <rect x="212" y="142" width="140" height="8" rx="3" fill="var(--landing-illust-muted)" />
      <rect x="212" y="156" width="170" height="8" rx="3" fill="var(--landing-illust-muted)" />
      <rect x="212" y="170" width="120" height="8" rx="3" fill="var(--landing-illust-muted)" />
      <rect x="212" y="192" width="80" height="24" rx="6" fill="var(--primary)" opacity="0.25" />
      <rect x="212" y="224" width="60" height="20" rx="4" fill="var(--tag)" opacity="0.35" />

      <rect
        x="368"
        y="128"
        width="72"
        height="120"
        rx="8"
        fill="var(--landing-illust-panel)"
        stroke="var(--landing-illust-border)"
        strokeWidth="1.5"
      />
      <rect x="376" y="138" width="56" height="40" rx="4" fill="var(--landing-illust-accent)" />
      <rect x="376" y="186" width="56" height="8" rx="2" fill="var(--landing-illust-border)" />
      <rect x="376" y="200" width="40" height="8" rx="2" fill="var(--landing-illust-border)" />

      <circle cx="168" cy="200" r="36" fill="#F5D0C5" className="dark:opacity-90" />
      <path
        d="M132 198c8-28 32-44 56-40 20 4 36 24 40 48 2 14-4 28-16 36"
        fill="#2D2A26"
        className="dark:fill-[#e8e8e6]"
      />
      <path d="M148 176c-6 20 4 44 24 52 18 8 40 2 52-14" fill="url(#hairGrad)" />
      <ellipse cx="168" cy="248" rx="42" ry="50" fill="url(#shirtGrad)" />
      <path d="M126 248h84v52c0 8-18 14-42 14s-42-6-42-14v-52z" fill="url(#shirtGrad)" />
      <rect x="108" y="268" width="28" height="8" rx="4" fill="#F5D0C5" className="dark:opacity-90" />
      <rect x="200" y="268" width="28" height="8" rx="4" fill="#F5D0C5" className="dark:opacity-90" />

      <rect
        x="40"
        y="300"
        width="48"
        height="56"
        rx="4"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
        transform="rotate(-8 64 328)"
      />
      <rect
        x="56"
        y="288"
        width="44"
        height="52"
        rx="4"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
        transform="rotate(6 78 314)"
      />
      <rect
        x="400"
        y="280"
        width="52"
        height="60"
        rx="4"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
        transform="rotate(12 426 310)"
      />

      <path
        d="M320 88c20-16 48-12 58 8 6 14 2 32-12 42"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="328" cy="72" r="6" fill="var(--tag)" opacity="0.65" />

      <defs>
        <linearGradient id="shirtGrad" x1="126" y1="248" x2="210" y2="310" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EEAD4" />
          <stop offset="0.5" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="140" y1="160" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E1B18" />
          <stop offset="1" stopColor="#3D3832" />
        </linearGradient>
      </defs>
    </svg>
  );
}
