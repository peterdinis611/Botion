/** Product mockup for Botion landing hero — theme-aware via CSS variables. */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="heroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--landing-blob-2)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--landing-blob-3)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--landing-blob-1)" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="heroAccentBar" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--tag)" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="snapThumb" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--landing-illust-accent)" />
          <stop offset="1" stopColor="var(--landing-illust-muted)" />
        </linearGradient>
        <filter id="heroShadow" x="-8%" y="-4%" width="116%" height="112%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="18"
            floodColor="var(--foreground)"
            floodOpacity="0.12"
          />
        </filter>
        <filter id="heroSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="8"
            floodColor="var(--foreground)"
            floodOpacity="0.08"
          />
        </filter>
      </defs>

      {/* Ambient background */}
      <ellipse cx="480" cy="100" rx="160" ry="110" fill="var(--landing-blob-1)" opacity="0.55" />
      <ellipse cx="100" cy="380" rx="120" ry="80" fill="var(--landing-blob-2)" opacity="0.45" />
      <ellipse cx="520" cy="360" rx="90" ry="60" fill="var(--landing-blob-3)" opacity="0.4" />
      <circle cx="300" cy="230" r="200" fill="url(#heroGlow)" opacity="0.35" />

      {/* Floating reference cards */}
      <g filter="url(#heroSoftShadow)" opacity="0.92" transform="rotate(-10 60 116)">
        <rect
          x="24"
          y="72"
          width="72"
          height="88"
          rx="10"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
          strokeWidth="1.5"
        />
        <rect x="36" y="88" width="48" height="6" rx="3" fill="var(--landing-illust-muted)" />
        <rect x="36" y="100" width="40" height="5" rx="2.5" fill="var(--landing-illust-muted)" />
        <rect x="36" y="112" width="44" height="5" rx="2.5" fill="var(--landing-illust-accent)" />
      </g>

      <g filter="url(#heroSoftShadow)" opacity="0.88" transform="rotate(8 539 348)">
        <rect
          x="500"
          y="300"
          width="78"
          height="96"
          rx="10"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
          strokeWidth="1.5"
        />
        <rect x="512" y="312" width="54" height="40" rx="6" fill="url(#snapThumb)" />
        <rect x="512" y="358" width="40" height="5" rx="2.5" fill="var(--landing-illust-muted)" />
      </g>

      {/* Main app window */}
      <g filter="url(#heroShadow)">
        <rect
          x="56"
          y="48"
          width="488"
          height="340"
          rx="16"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
          strokeWidth="1.5"
        />

        {/* Sidebar */}
        <rect x="56" y="48" width="128" height="340" rx="16" fill="var(--sidebar)" />
        <rect x="184" y="48" width="1" height="340" fill="var(--landing-illust-border)" />

        {/* Brand */}
        <rect x="72" y="68" width="24" height="24" rx="6" fill="var(--foreground)" />
        <text x="80" y="84" fill="var(--background)" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          B
        </text>
        <text x="102" y="84" fill="var(--foreground)" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
          Botion
        </text>

        {/* Search */}
        <rect x="72" y="104" width="96" height="28" rx="8" fill="var(--sidebar-accent)" />
        <circle cx="86" cy="118" r="5" stroke="var(--muted-foreground)" strokeWidth="1.5" />
        <line x1="90" y1="122" x2="94" y2="126" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="98" y="114" width="52" height="6" rx="3" fill="var(--landing-illust-muted)" />

        <text x="72" y="152" fill="var(--muted-foreground)" fontSize="9" fontWeight="600" letterSpacing="0.08em" fontFamily="system-ui, sans-serif">
          PAGES
        </text>

        {/* Active page */}
        <rect x="68" y="160" width="104" height="32" rx="8" fill="var(--sidebar-accent)" />
        <text x="80" y="180" fill="var(--foreground)" fontSize="12" fontFamily="system-ui, sans-serif">
          📄 Product brief
        </text>

        <rect x="68" y="198" width="104" height="28" rx="8" fill="transparent" />
        <text x="80" y="216" fill="var(--muted-foreground)" fontSize="12" fontFamily="system-ui, sans-serif">
          📘 Research
        </text>

        <rect x="68" y="230" width="104" height="28" rx="8" fill="transparent" />
        <text x="80" y="248" fill="var(--muted-foreground)" fontSize="12" fontFamily="system-ui, sans-serif">
          🗒️ Meeting notes
        </text>

        <text x="72" y="282" fill="var(--muted-foreground)" fontSize="9" fontWeight="600" letterSpacing="0.08em" fontFamily="system-ui, sans-serif">
          TAGS
        </text>
        <rect x="72" y="290" width="56" height="22" rx="6" fill="var(--tag)" fillOpacity="0.22" />
        <text x="82" y="305" fill="var(--tag-foreground)" fontSize="11" fontFamily="system-ui, sans-serif">
          #launch
        </text>

        {/* Main column */}
        <rect x="184" y="48" width="272" height="340" fill="var(--landing-illust-surface)" />
        <line x1="184" y1="96" x2="456" y2="96" stroke="var(--landing-illust-border)" />

        {/* Doc header */}
        <text x="200" y="78" fill="var(--foreground)" fontSize="13" fontFamily="system-ui, sans-serif">
          📄 Product brief
        </text>
        <circle cx="420" cy="74" r="14" fill="var(--landing-illust-muted)" />
        <circle cx="444" cy="74" r="14" fill="var(--landing-illust-muted)" />

        {/* Title & body */}
        <rect x="200" y="116" width="200" height="16" rx="5" fill="var(--foreground)" fillOpacity="0.12" />
        <rect x="200" y="144" width="120" height="8" rx="4" fill="var(--landing-illust-muted)" />
        <rect x="200" y="162" width="220" height="7" rx="3.5" fill="var(--landing-illust-muted)" />
        <rect x="200" y="176" width="200" height="7" rx="3.5" fill="var(--landing-illust-muted)" />
        <rect x="200" y="190" width="180" height="7" rx="3.5" fill="var(--landing-illust-muted)" />

        {/* Highlight block */}
        <rect
          x="200"
          y="212"
          width="228"
          height="56"
          rx="10"
          fill="var(--landing-illust-accent)"
          stroke="var(--primary)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <rect x="212" y="224" width="8" height="32" rx="4" fill="url(#heroAccentBar)" />
        <rect x="228" y="226" width="140" height="7" rx="3.5" fill="var(--foreground)" fillOpacity="0.1" />
        <rect x="228" y="240" width="180" height="6" rx="3" fill="var(--landing-illust-muted)" />
        <rect x="228" y="252" width="120" height="6" rx="3" fill="var(--landing-illust-muted)" />

        <rect x="200" y="284" width="210" height="7" rx="3.5" fill="var(--landing-illust-muted)" />
        <rect x="200" y="298" width="160" height="7" rx="3.5" fill="var(--landing-illust-muted)" />

        {/* Snaps panel */}
        <rect x="456" y="48" width="88" height="340" fill="var(--landing-illust-panel)" />
        <line x1="456" y1="48" x2="456" y2="388" stroke="var(--landing-illust-border)" />

        <text x="468" y="78" fill="var(--foreground)" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">
          Snaps
        </text>
        <circle cx="528" cy="72" r="12" fill="var(--primary)" fillOpacity="0.18" />
        <text x="524" y="76" fill="var(--primary)" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">
          +
        </text>

        <rect
          x="468"
          y="92"
          width="64"
          height="72"
          rx="8"
          fill="url(#snapThumb)"
          stroke="var(--landing-illust-border)"
          strokeWidth="1"
        />
        <rect x="476" y="100" width="36" height="5" rx="2.5" fill="var(--landing-illust-surface)" fillOpacity="0.7" />
        <rect x="476" y="110" width="48" height="4" rx="2" fill="var(--landing-illust-surface)" fillOpacity="0.45" />

        <rect
          x="468"
          y="172"
          width="30"
          height="30"
          rx="6"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
        />
        <rect
          x="502"
          y="172"
          width="30"
          height="30"
          rx="6"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
        />
        <rect
          x="468"
          y="208"
          width="64"
          height="44"
          rx="8"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
        />
        <rect x="476" y="216" width="48" height="28" rx="4" fill="var(--landing-illust-accent)" />
      </g>

      {/* Live collaboration cue */}
      <g filter="url(#heroSoftShadow)">
        <rect
          x="168"
          y="28"
          width="118"
          height="32"
          rx="16"
          fill="var(--landing-illust-surface)"
          stroke="var(--landing-illust-border)"
          strokeWidth="1.5"
        />
        <circle cx="188" cy="44" r="10" fill="#5EEAD4" />
        <circle cx="206" cy="44" r="10" fill="#818CF8" />
        <circle cx="224" cy="44" r="10" fill="#F5D0C5" />
        <rect x="240" y="38" width="36" height="6" rx="3" fill="var(--landing-illust-muted)" />
      </g>

      {/* Tag floating pill */}
      <rect
        x="380"
        y="400"
        width="88"
        height="28"
        rx="14"
        fill="var(--landing-illust-surface)"
        stroke="var(--landing-illust-border)"
        strokeWidth="1.5"
        filter="url(#heroSoftShadow)"
      />
      <rect x="392" y="410" width="48" height="8" rx="4" fill="var(--tag)" fillOpacity="0.35" />
      <text x="400" y="418" fill="var(--tag-foreground)" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
        #ideas
      </text>
    </svg>
  );
}
