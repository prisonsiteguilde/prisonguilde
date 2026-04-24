import { motion, type Variants } from "framer-motion";
import type { MonsterArchetype, ElementId } from "@ton-abyss/shared";

type AnimState = "idle" | "hit" | "attack" | "death" | "telegraph";

const ELEMENT_COLOR: Record<ElementId, { primary: string; glow: string }> = {
  physical: { primary: "#fca5a5", glow: "rgba(244,63,94,0.55)" },
  fire:     { primary: "#fb923c", glow: "rgba(251,146,60,0.7)" },
  frost:    { primary: "#7dd3fc", glow: "rgba(125,211,252,0.7)" },
  shock:    { primary: "#fde047", glow: "rgba(253,224,71,0.7)" },
  void:     { primary: "#d946ef", glow: "rgba(217,70,239,0.7)" },
  holy:     { primary: "#fef3c7", glow: "rgba(254,243,199,0.7)" },
};

/**
 * Large animated creature silhouette for combat.
 * Size variants: `md` (in-list, 96px) / `lg` (combat hero, 220px)
 */
export function CreatureSprite({
  archetype,
  element,
  size = "lg",
  state = "idle",
  isBoss = false,
}: {
  archetype: MonsterArchetype;
  element: ElementId;
  size?: "md" | "lg";
  state?: AnimState;
  isBoss?: boolean;
}) {
  const palette = ELEMENT_COLOR[element] ?? ELEMENT_COLOR.physical;
  const color = palette.primary;
  const glow = palette.glow;
  const px = size === "lg" ? 220 : 96;

  const variants: Variants = {
    idle: { y: [0, -4, 0], scale: 1, rotate: 0, filter: "none", opacity: 1 },
    telegraph: { scale: [1, 1.08, 1], y: [0, -2, 0], filter: `drop-shadow(0 0 22px ${glow})`, opacity: 1 },
    attack: { x: [0, -30, 12, 0], scale: [1, 1.08, 0.96, 1], opacity: 1 },
    hit: { x: [0, -10, 8, -4, 0], filter: "brightness(2.2) saturate(0.5)", opacity: 1 },
    death: { opacity: [1, 0.6, 0], scale: [1, 0.9, 0.7], filter: "blur(3px) saturate(0)", y: [0, 12, 24] },
  };

  const transition =
    state === "idle"
      ? { y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }
      : state === "telegraph"
      ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
      : state === "attack"
      ? { duration: 0.55, ease: "easeOut" }
      : state === "hit"
      ? { duration: 0.35 }
      : { duration: 0.9, ease: "easeOut" };

  return (
    <motion.div
      animate={state}
      variants={variants}
      transition={transition}
      style={{ width: px, height: px, position: "relative" }}
    >
      {/* Aura/glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${glow} 0%, transparent 68%)`,
          filter: "blur(8px)",
          opacity: state === "telegraph" ? 1 : 0.55,
          transition: "opacity 0.3s",
        }}
      />
      {/* Ground pad */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-1 rounded-full pointer-events-none"
        style={{
          width: px * 0.7,
          height: px * 0.08,
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          opacity: 0.35,
        }}
      />
      <svg width={px} height={px} viewBox="0 0 200 200" className="relative block">
        <defs>
          <linearGradient id={`cr-grad-${archetype}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id={`cr-eye-${archetype}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <Silhouette archetype={archetype} isBoss={isBoss} gradId={`cr-grad-${archetype}`} eyeId={`cr-eye-${archetype}`} color={color} />
      </svg>
      {/* Floating particles for bosses */}
      {isBoss && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 4,
                height: 4,
                background: color,
                boxShadow: `0 0 6px ${color}`,
                left: `${20 + i * 14}%`,
                bottom: `${20 + (i % 2) * 8}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2.8 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

function Silhouette({ archetype, isBoss, gradId, eyeId, color }: { archetype: MonsterArchetype; isBoss: boolean; gradId: string; eyeId: string; color: string }) {
  switch (archetype) {
    case "caster":
      return <CasterShape gradId={gradId} eyeId={eyeId} color={color} />;
    case "brute":
    case "elite":
      return <BruteShape gradId={gradId} eyeId={eyeId} color={color} isBoss={isBoss} />;
    case "miniboss":
    case "boss":
    case "apex":
      return <BossShape gradId={gradId} eyeId={eyeId} color={color} />;
    case "skirmisher":
      return <SkirmisherShape gradId={gradId} eyeId={eyeId} color={color} />;
    case "grunt":
    default:
      return <GruntShape gradId={gradId} eyeId={eyeId} color={color} />;
  }
}

function Eyes({ eyeId, y = 82, spread = 14 }: { eyeId: string; y?: number; spread?: number }) {
  return (
    <g>
      <circle cx={100 - spread} cy={y} r="6" fill={`url(#${eyeId})`} />
      <circle cx={100 + spread} cy={y} r="6" fill={`url(#${eyeId})`} />
      <circle cx={100 - spread} cy={y} r="2" fill="#fff" />
      <circle cx={100 + spread} cy={y} r="2" fill="#fff" />
    </g>
  );
}

function GruntShape({ gradId, eyeId, color }: { gradId: string; eyeId: string; color: string }) {
  return (
    <g>
      {/* body */}
      <path d="M60 160 Q60 100 100 100 Q140 100 140 160 L130 180 Q115 188 100 188 Q85 188 70 180 Z" fill={`url(#${gradId})`} />
      {/* head */}
      <ellipse cx="100" cy="82" rx="26" ry="30" fill={`url(#${gradId})`} />
      {/* horns */}
      <path d="M80 62 Q72 40 86 44 M120 62 Q128 40 114 44" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Eyes eyeId={eyeId} />
      {/* shoulders */}
      <ellipse cx="70" cy="115" rx="16" ry="12" fill={`url(#${gradId})`} opacity="0.8" />
      <ellipse cx="130" cy="115" rx="16" ry="12" fill={`url(#${gradId})`} opacity="0.8" />
      {/* weapon hint */}
      <rect x="135" y="110" width="4" height="55" fill={color} opacity="0.75" rx="2" />
      <polygon points="130,108 144,108 137,96" fill={color} opacity="0.8" />
    </g>
  );
}

function SkirmisherShape({ gradId, eyeId, color }: { gradId: string; eyeId: string; color: string }) {
  return (
    <g>
      <path d="M66 160 Q66 108 100 104 Q134 108 134 160 L126 180 Q112 185 100 185 Q88 185 74 180 Z" fill={`url(#${gradId})`} />
      <ellipse cx="100" cy="78" rx="22" ry="26" fill={`url(#${gradId})`} />
      <Eyes eyeId={eyeId} y={76} />
      {/* dual-blades */}
      <rect x="52" y="110" width="3" height="55" fill={color} opacity="0.8" rx="1.5" />
      <rect x="145" y="110" width="3" height="55" fill={color} opacity="0.8" rx="1.5" />
      <polygon points="47,108 60,108 53,98" fill={color} opacity="0.85" />
      <polygon points="140,108 153,108 146,98" fill={color} opacity="0.85" />
    </g>
  );
}

function CasterShape({ gradId, eyeId, color }: { gradId: string; eyeId: string; color: string }) {
  return (
    <g>
      {/* robes */}
      <path d="M48 188 Q50 120 100 96 Q150 120 152 188 Z" fill={`url(#${gradId})`} />
      {/* hood */}
      <path d="M70 96 Q100 50 130 96 L120 120 Q100 108 80 120 Z" fill={color} opacity="0.9" />
      {/* glowing eye inside hood */}
      <circle cx="100" cy="100" r="6" fill={`url(#${eyeId})`} opacity="0.95" />
      <circle cx="100" cy="100" r="2.5" fill="#fff" />
      {/* staff */}
      <rect x="155" y="60" width="3" height="130" fill={color} opacity="0.85" rx="1.5" />
      <circle cx="156.5" cy="58" r="8" fill={color} opacity="0.95" />
      <circle cx="156.5" cy="58" r="4" fill="#fff" opacity="0.9" />
    </g>
  );
}

function BruteShape({ gradId, eyeId, color, isBoss }: { gradId: string; eyeId: string; color: string; isBoss: boolean }) {
  return (
    <g>
      {/* massive torso */}
      <path d="M46 168 Q44 96 100 88 Q156 96 154 168 L142 188 Q118 196 100 196 Q82 196 58 188 Z" fill={`url(#${gradId})`} />
      {/* head low on body (hulking) */}
      <ellipse cx="100" cy="72" rx="28" ry="26" fill={`url(#${gradId})`} />
      {/* big horns */}
      <path d="M76 50 Q64 22 88 30 M124 50 Q136 22 112 30" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Eyes eyeId={eyeId} y={72} spread={12} />
      {/* fists */}
      <circle cx="40" cy="150" r="18" fill={`url(#${gradId})`} />
      <circle cx="160" cy="150" r="18" fill={`url(#${gradId})`} />
      {isBoss && (
        <path d="M94 72 L100 80 L106 72 L100 64 Z" fill="#fff" opacity="0.8" />
      )}
    </g>
  );
}

function BossShape({ gradId, eyeId, color }: { gradId: string; eyeId: string; color: string }) {
  return (
    <g>
      {/* wing silhouette */}
      <path d="M40 120 Q10 90 30 60 Q46 88 60 110 Z" fill={color} opacity="0.55" />
      <path d="M160 120 Q190 90 170 60 Q154 88 140 110 Z" fill={color} opacity="0.55" />
      {/* body */}
      <path d="M52 176 Q46 98 100 86 Q154 98 148 176 L132 194 Q116 200 100 200 Q84 200 68 194 Z" fill={`url(#${gradId})`} />
      {/* head with crown */}
      <ellipse cx="100" cy="74" rx="30" ry="30" fill={`url(#${gradId})`} />
      <path d="M74 54 L84 38 L94 54 L100 36 L106 54 L116 38 L126 54 Z" fill={color} />
      <Eyes eyeId={eyeId} y={76} spread={14} />
      {/* mouth/fangs */}
      <path d="M88 92 L100 104 L112 92 L108 96 L100 100 L92 96 Z" fill="#000" opacity="0.6" />
      {/* claws */}
      <path d="M32 158 L52 152 L40 168 Z" fill={color} />
      <path d="M168 158 L148 152 L160 168 Z" fill={color} />
    </g>
  );
}
