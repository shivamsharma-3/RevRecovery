import React from 'react';

/**
 * Brand illustrations, replacing the picsum.photos placeholders that were used
 * across the marketing site.
 *
 * Deliberately drawn rather than photographed: stock photography of clinics
 * reads generic, and every picsum URL was a third-party request that would take
 * the page down with it. These are a few KB, need no network, and carry no
 * licensing risk.
 *
 * Each variant fills its container (`absolute inset-0` friendly) via
 * preserveAspectRatio="xMidYMid slice".
 */

export type IllustrationVariant =
  | 'dental'
  | 'surgical'
  | 'specialty'
  | 'enterprise'
  | 'integration'
  | 'analysis'
  | 'outreach'
  | 'recovered'
  | 'security'
  | 'team'
  | 'dashboard';

const TEAL = {
  deep: '#0f766e',
  mid: '#0d9488',
  bright: '#14b8a6',
  pale: '#99f6e4',
  wash: '#f0fdfa',
};

function Frame({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#042f2e" />
          <stop offset="55%" stopColor={TEAL.deep} />
          <stop offset="100%" stopColor={TEAL.mid} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.75" cy="0.2" r="0.75">
          <stop offset="0%" stopColor={TEAL.bright} stopOpacity="0.55" />
          <stop offset="100%" stopColor={TEAL.bright} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#${id}-bg)`} />
      <rect width="800" height="600" fill={`url(#${id}-glow)`} />
      {children}
      <rect width="800" height="600" fill={`url(#${id}-sheen)`} />
    </svg>
  );
}

/** Faint dot grid — gives the flat fills some texture. */
function Grid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-dots`} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#ffffff" fillOpacity="0.12" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-dots)`} />
    </>
  );
}

function Dental({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      {/* Molar silhouette */}
      <path
        d="M400 150c-58 0-95 30-95 82 0 38 14 62 22 104 6 32 4 66 12 92 6 20 32 22 40 2 10-26 8-62 14-84 4-14 10-20 20-20s16 6 20 20c6 22 4 58 14 84 8 20 34 18 40-2 8-26 6-60 12-92 8-42 22-66 22-104 0-52-37-82-95-82z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
      <path
        d="M400 150c-58 0-95 30-95 82 0 14 2 26 5 37 22-16 54-25 90-25s68 9 90 25c3-11 5-23 5-37 0-52-37-82-95-82z"
        fill={TEAL.pale}
        fillOpacity="0.5"
      />
      {/* Chart ticks */}
      <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round">
        <path d="M120 430h90M120 460h60M120 490h120" />
        <path d="M590 430h90M620 460h60M560 490h120" />
      </g>
    </Frame>
  );
}

function Surgical({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      {/* Overhead surgical light */}
      <circle cx="400" cy="190" r="96" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="400" cy="190" r="62" fill={TEAL.wash} fillOpacity="0.85" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={400 + 62 * Math.cos((a * Math.PI) / 180)}
          cy={190 + 62 * Math.sin((a * Math.PI) / 180)}
          r="20"
          fill="#ffffff"
          fillOpacity="0.95"
        />
      ))}
      <rect x="392" y="286" width="16" height="70" fill="#ffffff" fillOpacity="0.6" />
      {/* Vitals trace */}
      <path
        d="M110 470h110l24-52 30 104 26-52h90l24-40 26 80 22-40h228"
        fill="none"
        stroke={TEAL.pale}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function Specialty({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      {/* Stethoscope */}
      <path
        d="M250 130v92c0 62 48 112 108 112s108-50 108-112v-92"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.92"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <circle cx="250" cy="126" r="20" fill="#ffffff" fillOpacity="0.92" />
      <circle cx="466" cy="126" r="20" fill="#ffffff" fillOpacity="0.92" />
      <path
        d="M358 334v58c0 46 38 82 84 82s84-36 84-82v-30"
        fill="none"
        stroke={TEAL.pale}
        strokeOpacity="0.9"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="526" cy="352" r="34" fill="#ffffff" fillOpacity="0.95" />
      <circle cx="526" cy="352" r="16" fill={TEAL.deep} fillOpacity="0.85" />
    </Frame>
  );
}

function Enterprise({ id }: { id: string }) {
  const towers = [
    { x: 150, h: 210 },
    { x: 270, h: 300 },
    { x: 390, h: 250 },
    { x: 510, h: 340 },
    { x: 630, h: 190 },
  ];
  return (
    <Frame id={id}>
      <Grid id={id} />
      {towers.map((t, i) => (
        <g key={t.x}>
          <rect
            x={t.x}
            y={520 - t.h}
            width="84"
            height={t.h}
            rx="8"
            fill="#ffffff"
            fillOpacity={i % 2 ? 0.9 : 0.75}
          />
          {Array.from({ length: Math.floor(t.h / 46) }).map((_, r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={t.x + 12 + c * 22}
                y={520 - t.h + 18 + r * 46}
                width="12"
                height="16"
                rx="2"
                fill={TEAL.deep}
                fillOpacity="0.35"
              />
            ))
          )}
        </g>
      ))}
      <rect x="110" y="520" width="580" height="10" rx="5" fill="#ffffff" fillOpacity="0.5" />
    </Frame>
  );
}

function Integration({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      <g stroke={TEAL.pale} strokeOpacity="0.75" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M210 300h130M460 300h130" />
        <path d="M275 300V180h120M275 300v120h120" />
        <path d="M525 300V180H405M525 300v120H405" />
      </g>
      {[
        [210, 300], [590, 300], [395, 180], [395, 420],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="26" fill="#ffffff" fillOpacity="0.9" />
      ))}
      <circle cx="400" cy="300" r="58" fill="#ffffff" fillOpacity="0.96" />
      <path
        d="M375 300l18 18 34-38"
        fill="none"
        stroke={TEAL.deep}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function Analysis({ id }: { id: string }) {
  const bars = [
    { x: 180, h: 90 }, { x: 260, h: 150 }, { x: 340, h: 118 },
    { x: 420, h: 208 }, { x: 500, h: 168 }, { x: 580, h: 250 },
  ];
  return (
    <Frame id={id}>
      <Grid id={id} />
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={470 - b.h}
          width="52"
          height={b.h}
          rx="10"
          fill="#ffffff"
          fillOpacity={0.45 + i * 0.09}
        />
      ))}
      <path
        d="M206 356l80-42 80 26 80-70 80 24 80-58"
        fill="none"
        stroke={TEAL.pale}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[206, 286, 366, 446, 526, 606].map((cx, i) => (
        <circle key={cx} cx={cx} cy={[356, 314, 340, 270, 294, 236][i]} r="9" fill="#ffffff" />
      ))}
      <rect x="150" y="470" width="500" height="8" rx="4" fill="#ffffff" fillOpacity="0.45" />
    </Frame>
  );
}

function Outreach({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      <rect x="200" y="150" width="300" height="180" rx="26" fill="#ffffff" fillOpacity="0.94" />
      <path d="M250 330l0 56 58-56z" fill="#ffffff" fillOpacity="0.94" />
      <g stroke={TEAL.deep} strokeOpacity="0.35" strokeWidth="12" strokeLinecap="round">
        <path d="M240 205h220M240 245h170M240 285h120" />
      </g>
      <rect x="380" y="300" width="240" height="150" rx="24" fill={TEAL.pale} fillOpacity="0.9" />
      <path d="M566 450l0 46-48-46z" fill={TEAL.pale} fillOpacity="0.9" />
      <g stroke={TEAL.deep} strokeOpacity="0.45" strokeWidth="11" strokeLinecap="round">
        <path d="M414 345h172M414 382h120" />
      </g>
    </Frame>
  );
}

function Recovered({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="400"
          cy={430 - i * 56}
          rx="132"
          ry="40"
          fill="#ffffff"
          fillOpacity={0.55 + i * 0.15}
        />
      ))}
      <circle cx="400" cy="220" r="76" fill="#ffffff" fillOpacity="0.97" />
      <path
        d="M366 220l24 26 46-54"
        fill="none"
        stroke={TEAL.mid}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g stroke={TEAL.pale} strokeOpacity="0.8" strokeWidth="6" strokeLinecap="round">
        <path d="M212 150l-28-28M588 150l28-28M180 260h-40M620 260h40" />
      </g>
    </Frame>
  );
}

function Security({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      <path
        d="M400 120l150 58v128c0 96-64 156-150 186-86-30-150-90-150-186V178l150-58z"
        fill="#ffffff"
        fillOpacity="0.94"
      />
      <path
        d="M400 120l150 58v128c0 96-64 156-150 186V120z"
        fill={TEAL.pale}
        fillOpacity="0.45"
      />
      <rect x="352" y="290" width="96" height="80" rx="14" fill={TEAL.deep} fillOpacity="0.9" />
      <path
        d="M372 290v-24a28 28 0 0156 0v24"
        fill="none"
        stroke={TEAL.deep}
        strokeOpacity="0.9"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="400" cy="326" r="10" fill="#ffffff" />
    </Frame>
  );
}

function Team({ id }: { id: string }) {
  const people = [
    { cx: 250, cy: 300, r: 46 },
    { cx: 400, cy: 258, r: 56 },
    { cx: 550, cy: 300, r: 46 },
  ];
  return (
    <Frame id={id}>
      <Grid id={id} />
      {people.map((p, i) => (
        <g key={p.cx} opacity={i === 1 ? 0.97 : 0.8}>
          <circle cx={p.cx} cy={p.cy} r={p.r} fill="#ffffff" />
          <path
            d={`M${p.cx - p.r * 1.55} ${p.cy + p.r * 2.5}c0-${p.r * 1.5} ${p.r * 0.7}-${p.r * 1.9} ${p.r * 1.55}-${p.r * 1.9}s${p.r * 1.55} ${p.r * 0.4} ${p.r * 1.55} ${p.r * 1.9}z`}
            fill="#ffffff"
          />
        </g>
      ))}
      <g stroke={TEAL.pale} strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round">
        <path d="M300 290h50M450 290h50" />
      </g>
    </Frame>
  );
}

function Dashboard({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <Grid id={id} />
      <rect x="120" y="120" width="560" height="360" rx="24" fill="#ffffff" fillOpacity="0.96" />
      <rect x="120" y="120" width="560" height="52" rx="24" fill={TEAL.wash} />
      <rect x="120" y="148" width="560" height="24" fill={TEAL.wash} />
      {[150, 178, 206].map((cx) => (
        <circle key={cx} cx={cx} cy="146" r="7" fill={TEAL.mid} fillOpacity="0.35" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={150 + i * 176}
          y="200"
          width="152"
          height="86"
          rx="14"
          fill={TEAL.wash}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={`b-${i}`} x="166" y={222 + i * 0} width="76" height="12" rx="6" fill={TEAL.mid} fillOpacity="0.3" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={`row-${i}`}>
          <rect x="150" y={312 + i * 40} width="440" height="28" rx="10" fill={TEAL.wash} />
          <rect x="164" y={321 + i * 40} width={160 - i * 24} height="10" rx="5" fill={TEAL.mid} fillOpacity="0.35" />
          <rect x="520" y={321 + i * 40} width="56" height="10" rx="5" fill={TEAL.bright} fillOpacity="0.55" />
        </g>
      ))}
    </Frame>
  );
}

const VARIANTS: Record<IllustrationVariant, (p: { id: string }) => React.JSX.Element> = {
  dental: Dental,
  surgical: Surgical,
  specialty: Specialty,
  enterprise: Enterprise,
  integration: Integration,
  analysis: Analysis,
  outreach: Outreach,
  recovered: Recovered,
  security: Security,
  team: Team,
  dashboard: Dashboard,
};

export function Illustration({
  variant,
  className = '',
}: {
  variant: IllustrationVariant;
  className?: string;
}) {
  const Component = VARIANTS[variant] ?? Dental;
  // Stable per-variant id keeps the SVG gradient defs unique without randomness.
  const id = `ill-${variant}`;
  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <Component id={id} />
    </div>
  );
}
