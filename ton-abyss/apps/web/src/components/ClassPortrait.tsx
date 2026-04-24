import type { ClassId } from "@ton-abyss/shared";

/**
 * Stylized SVG portraits for the 4 classes.
 * Heavily gradient-based, iconic silhouette + class symbol.
 * All inline SVG; no external assets.
 */

type Props = {
  classId: ClassId;
  size?: number;
  animated?: boolean;
};

const PALETTE: Record<ClassId, { a: string; b: string; c: string }> = {
  warden:     { a: "#fbbf24", b: "#92400e", c: "#facc15" },
  runesmith:  { a: "#60a5fa", b: "#1e3a8a", c: "#bae6fd" },
  voidcaller: { a: "#c084fc", b: "#4c1d95", c: "#f0abfc" },
  beastbound: { a: "#22d3ee", b: "#064e3b", c: "#86efac" },
};

export function ClassPortrait({ classId, size = 120, animated = true }: Props) {
  const p = PALETTE[classId];
  const gradId = `grad-${classId}`;
  const glowId = `glow-${classId}`;
  return (
    <svg viewBox="0 0 120 140" width={size} height={size * (140 / 120)} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.a} />
          <stop offset="60%" stopColor={p.c} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p.b} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.a} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.a} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura glow */}
      <circle cx="60" cy="70" r="55" fill={`url(#${glowId})`}>
        {animated && <animate attributeName="r" values="55;58;55" dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Class-specific silhouette */}
      {classId === "warden" && <WardenSilhouette fill={`url(#${gradId})`} stroke={p.b} />}
      {classId === "runesmith" && <RunesmithSilhouette fill={`url(#${gradId})`} stroke={p.b} />}
      {classId === "voidcaller" && <VoidcallerSilhouette fill={`url(#${gradId})`} stroke={p.b} />}
      {classId === "beastbound" && <BeastboundSilhouette fill={`url(#${gradId})`} stroke={p.b} />}

      {/* Ambient particles */}
      {animated && (
        <>
          <circle cx="30" cy="40" r="1.5" fill={p.a} opacity="0.8">
            <animate attributeName="cy" values="40;20;40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="60" r="1.5" fill={p.c} opacity="0.8">
            <animate attributeName="cy" values="60;40;60" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="80" r="1" fill={p.c}>
            <animate attributeName="cy" values="80;60;80" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

function WardenSilhouette({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5">
      {/* helm */}
      <path d="M40 35 Q60 15 80 35 L80 55 Q60 62 40 55 Z" fill={fill} />
      {/* visor */}
      <rect x="50" y="40" width="20" height="4" fill={stroke} opacity="0.7" />
      {/* body plate */}
      <path d="M35 60 L50 75 L50 110 L40 125 L30 125 L25 80 Z" fill={fill} />
      <path d="M85 60 L70 75 L70 110 L80 125 L90 125 L95 80 Z" fill={fill} />
      {/* chest plate */}
      <path d="M50 75 L70 75 L72 115 L48 115 Z" fill={fill} opacity="0.9" />
      {/* tower shield (left) */}
      <path d="M15 60 L30 55 L30 115 L15 110 Z" fill={fill} opacity="0.85" />
      <path d="M20 70 L25 80 L22 90" fill="none" stroke={stroke} opacity="0.6" />
      {/* sword (right) */}
      <path d="M100 50 L105 50 L105 100 L100 100 Z" fill={stroke} />
      <path d="M97 100 L108 100 L106 106 L99 106 Z" fill={stroke} />
    </g>
  );
}

function RunesmithSilhouette({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5">
      {/* hood */}
      <path d="M40 30 Q60 10 80 30 L82 55 Q60 50 38 55 Z" fill={fill} />
      {/* face shadow */}
      <ellipse cx="60" cy="42" rx="14" ry="10" fill={stroke} opacity="0.4" />
      {/* robe */}
      <path d="M30 60 L50 55 L50 130 L35 130 Z" fill={fill} />
      <path d="M90 60 L70 55 L70 130 L85 130 Z" fill={fill} />
      <path d="M50 55 L70 55 L75 130 L45 130 Z" fill={fill} opacity="0.85" />
      {/* rune glyphs on chest */}
      <circle cx="60" cy="80" r="10" fill="none" stroke={stroke} opacity="0.7" />
      <path d="M56 76 L60 84 L64 76 M60 80 L60 90" stroke={stroke} opacity="0.7" fill="none" />
      {/* hammer */}
      <rect x="22" y="75" width="3" height="40" fill={stroke} />
      <rect x="15" y="68" width="16" height="12" fill={stroke} />
      <rect x="17" y="70" width="12" height="8" fill={fill} opacity="0.6" />
    </g>
  );
}

function VoidcallerSilhouette({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5">
      {/* hood tall */}
      <path d="M35 30 Q60 -5 85 30 L88 60 Q60 58 32 60 Z" fill={fill} />
      {/* face void */}
      <ellipse cx="60" cy="42" rx="12" ry="10" fill="#000" />
      {/* eyes */}
      <circle cx="55" cy="40" r="2" fill="#f0abfc" />
      <circle cx="65" cy="40" r="2" fill="#f0abfc" />
      {/* robe flowing */}
      <path d="M28 62 Q20 100 35 130 L55 130 L50 62 Z" fill={fill} />
      <path d="M92 62 Q100 100 85 130 L65 130 L70 62 Z" fill={fill} />
      <path d="M50 62 L70 62 L72 130 L48 130 Z" fill={fill} opacity="0.85" />
      {/* orb */}
      <circle cx="95" cy="95" r="8" fill="#000" stroke={stroke} />
      <circle cx="95" cy="95" r="4" fill={fill} opacity="0.8">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* void wisps */}
      <path d="M30 80 Q25 90 32 95" fill="none" stroke={fill} opacity="0.6" />
      <path d="M90 75 Q98 82 92 90" fill="none" stroke={fill} opacity="0.6" />
    </g>
  );
}

function BeastboundSilhouette({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5">
      {/* head */}
      <circle cx="60" cy="38" r="16" fill={fill} />
      {/* face mask */}
      <path d="M48 36 L52 42 L56 36 M64 36 L68 42 L72 36" fill="none" stroke={stroke} />
      {/* leather body */}
      <path d="M40 55 L55 68 L55 120 L45 130 L35 125 L30 85 Z" fill={fill} />
      <path d="M80 55 L65 68 L65 120 L75 130 L85 125 L90 85 Z" fill={fill} />
      <path d="M55 68 L65 68 L68 125 L52 125 Z" fill={fill} opacity="0.85" />
      {/* bow (left) */}
      <path d="M15 60 Q10 95 15 125" fill="none" stroke={stroke} strokeWidth="2.5" />
      <line x1="15" y1="60" x2="15" y2="125" stroke={stroke} opacity="0.6" />
      {/* wolf companion */}
      <g transform="translate(90 110)">
        <path d="M0 5 Q-3 0 2 -3 Q6 -5 10 -2 L14 -4 L12 1 L16 4 L10 7 Z" fill={fill} opacity="0.9" />
        <circle cx="4" cy="0" r="0.8" fill={stroke} />
      </g>
    </g>
  );
}
