import type { SVGProps } from "react";

/**
 * SVG icon system for TON Abyss.
 * Every icon is 24x24 viewBox, currentColor stroke/fill so it inherits text colors.
 * No external assets; all inline.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

// --- Combat icons ---
export const IconSword = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 4l5.5 5.5-1.4 1.4-1.4-1.4-2.1 2.1-2.5-2.5 2.1-2.1-1.4-1.4L14.5 4z" />
    <path d="M12.8 11.8l-8 8 1.5 1.5 8-8" />
    <path d="M4 20l1.5-1.5" />
  </Svg>
);

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 3v5.5c0 4.7-3.4 9-8 10-4.6-1-8-5.3-8-10V6l8-3z" />
  </Svg>
);

export const IconStaff = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="18" cy="6" r="2.5" />
    <path d="M16.2 7.8l-12 12" />
    <path d="M14 6l2-2M21 8l1.5-1.5" strokeOpacity="0.5" />
  </Svg>
);

export const IconBow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 3c6 2 10 8 10 15-2 0-5-2-7-4s-4-5-5-11h2z" />
    <path d="M5 3l15 15" />
  </Svg>
);

export const IconDagger = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v10l-2 2-2-2 2-10h2z" />
    <path d="M10 15l-4 4" />
    <path d="M14 3h-4" />
  </Svg>
);

export const IconHammer = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3h7v5h-7z" />
    <path d="M17 8l-11 11-3-3L14 5" />
  </Svg>
);

export const IconBoots = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4h4v8l4 2v4H5v-6l2-2V4z" />
  </Svg>
);

export const IconHelm = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 14c0-5 3.5-9 8-9s8 4 8 9v1H4v-1z" />
    <path d="M4 15h16v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
  </Svg>
);

export const IconChest = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 5l3-2h6l3 2v15H6V5z" />
    <path d="M9 9l3 2 3-2" />
  </Svg>
);

export const IconGloves = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3v7l-2 2v7h10v-7l-2-2V5a2 2 0 10-4 0V4a1 1 0 00-2 0z" />
  </Svg>
);

export const IconLegs = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 4h8v5l-1 12h-2l-1-8-1 8H9L8 9z" />
  </Svg>
);

export const IconRing = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="15" r="5" />
    <path d="M9 10l-1-5h8l-1 5" />
  </Svg>
);

export const IconAmulet = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4l7 4 7-4-3 6-4 10-4-10-3-6z" />
  </Svg>
);

export const IconTrinket = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
  </Svg>
);

export const IconCape = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3l4 3 4-3 3 17-7 2-7-2 3-17z" />
  </Svg>
);

export const IconPotion = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 3h4v4l3 4v8H7V11l3-4V3z" />
    <path d="M7 14h10" />
  </Svg>
);

export const IconRune = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 5v8l-8 5-8-5V8l8-5z" />
    <path d="M12 8v8M8 10l4 2 4-2" />
  </Svg>
);

// --- Resource icons ---
export const IconGold = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7v10M9 9h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3h5" />
  </Svg>
);

export const IconShard = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l6 6-6 12-6-12z" />
    <path d="M6 9l12 0" strokeOpacity="0.5" />
  </Svg>
);

export const IconDust = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="16" cy="10" r="1.5" />
    <circle cx="12" cy="14" r="1.5" />
    <circle cx="7" cy="16" r="1.5" />
    <circle cx="17" cy="17" r="1.5" />
    <circle cx="13" cy="6" r="1" />
  </Svg>
);

export const IconEssence = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3C8 7 6 11 6 14a6 6 0 0012 0c0-3-2-7-6-11z" />
  </Svg>
);

// --- Stat icons ---
export const IconHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
  </Svg>
);

export const IconMana = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c-4 5-7 9-7 12a7 7 0 0014 0c0-3-3-7-7-12z" />
  </Svg>
);

export const IconAttack = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19l14-14M5 5l5 5M14 10l5 5" />
  </Svg>
);

export const IconSpell = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2 7h7l-6 4 2 7-5-4-5 4 2-7-6-4h7z" />
  </Svg>
);

export const IconDefense = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

export const IconCrit = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11l6-2-2 6 10-10-2 6 6-2-10 10-2-6-6 2 10-10" strokeOpacity="0" />
    <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
  </Svg>
);

export const IconSpeed = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3L5 14h6l-2 7 8-11h-6l2-7z" />
  </Svg>
);

export const IconDodge = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="7" cy="12" r="3" />
    <circle cx="17" cy="12" r="3" strokeOpacity="0.5" />
    <path d="M10 12h4" strokeOpacity="0.5" />
  </Svg>
);

export const IconLuck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2 6-6-2 2 6-6 2 6 2-2 6 6-2 2 6 2-6 6 2-2-6 6-2-6-2 2-6-6 2 2-6z" strokeOpacity="0" />
    <path d="M12 5v4M10 12a2 2 0 104 0v-1M7 9l2 2M17 9l-2 2M8 15l2-1M16 15l-2-1M10 19h4" />
  </Svg>
);

// --- Elements ---
export const IconFire = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s4 3 4 8a4 4 0 01-8 0c0-2 1-3 2-4 0 2 1 3 2 4 0-3-2-5 0-8z" />
  </Svg>
);

export const IconFrost = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19" />
  </Svg>
);

export const IconShock = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3L6 13h5l-2 8 7-10h-5l2-8z" />
  </Svg>
);

export const IconVoid = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </Svg>
);

export const IconHoly = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v18M3 12h18M8 5l8 14M16 5L8 19" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="4" />
  </Svg>
);

// --- Menu tile icons (larger, decorative) ---
export const IconMap = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 5l6 2 6-2 6 2v12l-6-2-6 2-6-2z" />
    <path d="M9 7v12M15 5v12" />
  </Svg>
);

export const IconDungeon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V9l8-6 8 6v11H4z" />
    <path d="M10 20v-5a2 2 0 014 0v5" />
    <path d="M6 12h2M16 12h2" />
  </Svg>
);

export const IconTower = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 20V8l2-3h6l2 3v12H7z" />
    <path d="M10 11h4M10 15h4M11 8v-3" />
    <path d="M9 20l-2-2M15 20l2-2" />
  </Svg>
);

export const IconArena = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l9 4v10l-9 4-9-4V7z" />
    <path d="M7 9l5 2 5-2M12 11v8" strokeOpacity="0.6" />
  </Svg>
);

export const IconHunt = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </Svg>
);

export const IconBag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 8h12l-1 12H7z" />
    <path d="M9 8V6a3 3 0 116 0v2" />
  </Svg>
);

export const IconStash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7h18v5H3z" />
    <path d="M4 12v9h16v-9" />
    <path d="M11 7v14M9 7v-2h6v2" />
  </Svg>
);

export const IconAnvil = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9h10l3 3h3" />
    <path d="M8 12v6M16 12v6M5 18h14v3H5z" />
  </Svg>
);

export const IconEnchant = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19l6-6M13 11l6-6M13 11l2 2M15 5l4 4" />
    <path d="M4 5l2 2M20 19l-2-2" strokeOpacity="0.4" />
  </Svg>
);

export const IconSocket = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
  </Svg>
);

export const IconTree = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <circle cx="9" cy="19" r="2" />
    <circle cx="15" cy="19" r="2" />
    <path d="M12 7v3l-4 2M12 10l4 2M8 14l-1 3M16 14l1 3" />
  </Svg>
);

export const IconPet = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="2" />
    <circle cx="15" cy="8" r="2" />
    <path d="M6 16c0-3 3-5 6-5s6 2 6 5v3H6z" />
  </Svg>
);

export const IconExpedition = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 11l-4 9 4-2 4 2-4-9z" />
    <path d="M15 12l3 3-1 5h-5" strokeOpacity="0.5" />
  </Svg>
);

export const IconMount = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 14c3-6 9-6 12-4l4-3-1 5 1 1-2 4H6z" />
    <path d="M7 18v3M15 18v3" />
  </Svg>
);

export const IconQuest = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4" />
    <path d="M9 11h6M9 14h6M9 17h4" />
  </Svg>
);

export const IconBounty = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" strokeOpacity="0.5" />
    <path d="M12 3v18M3 12h18" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconAchievement = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="10" r="5" />
    <path d="M8 14l-2 7 6-3 6 3-2-7" />
  </Svg>
);

export const IconClan = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4l4-1 3 2 3-2 4 1v9l-4 5h-6l-4-5z" />
    <path d="M9 8l3 3 3-3" />
  </Svg>
);

export const IconFaction = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l9 4-1 6c0 3-3 6-8 8-5-2-8-5-8-8L3 7z" />
  </Svg>
);

export const IconLeaderboard = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h16M8 20V10M12 20V4M16 20v-7" />
  </Svg>
);

export const IconRelic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2 5 5 1-4 4 1 5-4-3-4 3 1-5-4-4 5-1z" />
  </Svg>
);

export const IconShop = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7l2-3h12l2 3v2a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-4 0V7z" />
    <path d="M5 9v11h14V9" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);

export const IconCodex = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h16v16H4z" />
    <path d="M12 4v16M4 12h16" strokeOpacity="0.4" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </Svg>
);

export const IconSkull = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 11a7 7 0 0114 0v5h-2v3h-2v-2h-2v2h-2v-2h-2v2H7v-3H5z" />
    <circle cx="9" cy="11" r="1.5" fill="currentColor" />
    <circle cx="15" cy="11" r="1.5" fill="currentColor" />
    <path d="M11 14h2" />
  </Svg>
);

export const IconSettings = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
  </Svg>
);

// --- Rarity tier icon (stylized gem) ---
export const IconGem = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 6-7 12-7-12z" />
    <path d="M5 9h14M9 3l3 6 3-6M9 9l3 12 3-12" />
  </Svg>
);

// Unified lookup for menu tile icon rendering.
export const ICONS = {
  map: IconMap,
  dungeons: IconDungeon,
  tower: IconTower,
  arena: IconArena,
  hunt: IconHunt,
  bag: IconBag,
  stash: IconStash,
  anvil: IconAnvil,
  enchant: IconEnchant,
  socket: IconSocket,
  tree: IconTree,
  pet: IconPet,
  expedition: IconExpedition,
  mount: IconMount,
  quest: IconQuest,
  bounty: IconBounty,
  achievement: IconAchievement,
  clan: IconClan,
  faction: IconFaction,
  leaderboard: IconLeaderboard,
  relic: IconRelic,
  shop: IconShop,
  codex: IconCodex,
  skull: IconSkull,
  settings: IconSettings,
  gold: IconGold,
  shard: IconShard,
  dust: IconDust,
  essence: IconEssence,
  heart: IconHeart,
  mana: IconMana,
  attack: IconAttack,
  spell: IconSpell,
  defense: IconDefense,
  crit: IconCrit,
  speed: IconSpeed,
  dodge: IconDodge,
  luck: IconLuck,
  fire: IconFire,
  frost: IconFrost,
  shock: IconShock,
  void: IconVoid,
  holy: IconHoly,
  sword: IconSword,
  shield: IconShield,
  staff: IconStaff,
  bow: IconBow,
  dagger: IconDagger,
  hammer: IconHammer,
  boots: IconBoots,
  helm: IconHelm,
  chest: IconChest,
  gloves: IconGloves,
  legs: IconLegs,
  ring: IconRing,
  amulet: IconAmulet,
  trinket: IconTrinket,
  cape: IconCape,
  potion: IconPotion,
  rune: IconRune,
  gem: IconGem,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 16, color }: { name: IconName; size?: number; color?: string }) {
  const C = ICONS[name];
  if (!C) return null;
  return <C size={size} color={color} />;
}
