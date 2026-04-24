import type {
  ClassId,
  DerivedStats,
  ElementId,
  ItemInstance,
  StatId,
} from "./types.js";
import { ELEMENTS } from "./types.js";
import { CLASS_BASE } from "./progression.js";

// Compute primary stats for a character given class + allocated points.
export function primaryStatsFor(
  classId: ClassId,
  level: number,
  allocated: Partial<Record<StatId, number>>,
): Record<StatId, number> {
  const base = { ...CLASS_BASE[classId] };
  // Classes gain a small auto growth per level in their favored stats (tuned for hardcore).
  const growth: Record<ClassId, Partial<Record<StatId, number>>> = {
    warden: { strength: 0.8, vitality: 0.7, agility: 0.2 },
    runesmith: { intellect: 0.8, spirit: 0.5, vitality: 0.35, strength: 0.25 },
    voidcaller: { intellect: 0.9, spirit: 0.7, agility: 0.2 },
    beastbound: { agility: 0.8, strength: 0.4, vitality: 0.4, luck: 0.15 },
  };
  const g = growth[classId];
  for (const k of Object.keys(base) as StatId[]) {
    base[k] = Math.round(base[k] + (g[k] ?? 0) * (level - 1));
  }
  for (const k of Object.keys(allocated) as StatId[]) {
    base[k] += allocated[k] ?? 0;
  }
  return base;
}

export function emptyDerived(): DerivedStats {
  const resistance = {} as Record<ElementId, number>;
  for (const el of ELEMENTS) resistance[el] = 0;
  return {
    maxHp: 0,
    maxMana: 0,
    attack: 0,
    spellPower: 0,
    defense: 0,
    resistance,
    critChance: 0.03,
    critMultiplier: 1.5,
    dodge: 0,
    accuracy: 0.95,
    blockChance: 0,
    blockAmount: 0,
    lifesteal: 0,
    speed: 0,
    luck: 0,
  };
}

// Derive combat stats from primary stats.
export function derivedFromPrimary(
  classId: ClassId,
  primary: Record<StatId, number>,
): DerivedStats {
  const d = emptyDerived();
  d.maxHp = Math.round(40 + primary.vitality * 9 + primary.strength * 1.2);
  d.maxMana = Math.round(20 + primary.intellect * 5 + primary.spirit * 3);
  d.attack = Math.round(primary.strength * 1.5 + primary.agility * 0.6);
  d.spellPower = Math.round(primary.intellect * 1.6 + primary.spirit * 0.5);
  d.defense = Math.round(primary.vitality * 0.8 + primary.strength * 0.2);
  d.critChance = 0.03 + primary.agility * 0.0025 + primary.luck * 0.003;
  d.critMultiplier = 1.5 + primary.luck * 0.005;
  d.dodge = primary.agility * 0.002;
  d.accuracy = 0.95 + primary.agility * 0.001;
  d.speed = primary.agility * 0.5;
  d.luck = primary.luck;
  // Class modifiers.
  if (classId === "warden") {
    d.defense += 6;
    d.blockChance += 0.05;
    d.blockAmount += 5;
  } else if (classId === "runesmith") {
    d.spellPower += 4;
    d.defense += 2;
  } else if (classId === "voidcaller") {
    d.spellPower += 6;
    d.resistance.void += 0.1;
  } else if (classId === "beastbound") {
    d.critChance += 0.02;
    d.dodge += 0.03;
  }
  return d;
}

// Apply all equipped item contributions to derived stats.
export function applyGear(base: DerivedStats, gear: ItemInstance[], getBase: (id: string) => { baseStats?: Partial<DerivedStats> } | undefined): DerivedStats {
  const out = cloneDerived(base);
  for (const it of gear) {
    const meta = getBase(it.baseId);
    if (meta?.baseStats) addDerived(out, meta.baseStats);
    for (const a of it.affixes) {
      applyAffix(out, a);
    }
    // Upgrade level: +4% weapon/armor scaling per level on relevant substats.
    // (Simplified — full system in GDD.)
  }
  clampDerived(out);
  return out;
}

export function cloneDerived(s: DerivedStats): DerivedStats {
  return {
    ...s,
    resistance: { ...s.resistance },
  };
}

export function addDerived(a: DerivedStats, b: Partial<DerivedStats>): void {
  for (const k of Object.keys(b) as (keyof DerivedStats)[]) {
    if (k === "resistance") {
      const rb = (b.resistance ?? {}) as Partial<Record<ElementId, number>>;
      for (const el of Object.keys(rb) as ElementId[]) {
        a.resistance[el] = (a.resistance[el] ?? 0) + (rb[el] ?? 0);
      }
    } else {
      const v = b[k];
      if (typeof v === "number") {
        (a[k] as number) = (a[k] as number) + v;
      }
    }
  }
}

import type { AffixRoll } from "./types.js";

export function applyAffix(d: DerivedStats, a: AffixRoll): void {
  switch (a.stat) {
    case "strength":
    case "agility":
    case "intellect":
    case "vitality":
    case "spirit":
    case "luck":
      // Primary stat affixes are applied via recompute; approximate here.
      // In the real pipeline the server recomputes from primary; this branch
      // is for preview/UI only.
      break;
    case "elemental_damage":
      // convert to flat attack; element-specific bonuses handled in combat
      d.attack += a.value;
      break;
    case "gold_find":
    case "xp_gain":
      // Non-combat stats are applied elsewhere.
      break;
    default: {
      const key = a.stat as keyof DerivedStats;
      if (key === "resistance") return;
      if (typeof d[key] === "number") {
        (d[key] as number) = (d[key] as number) + a.value;
      }
      break;
    }
  }
}

// Hardcore caps. Values above the soft cap have diminishing returns;
// the hard cap is the absolute ceiling.
function softCap(value: number, soft: number, hard: number): number {
  if (value <= soft) return value;
  const over = value - soft;
  // Each point above soft contributes 0.4 of its value, capped at hard.
  return Math.min(hard, soft + over * 0.4);
}

export function clampDerived(d: DerivedStats): void {
  // Crit chance: soft 60%, hard 75% (no insta-100% builds).
  d.critChance = Math.max(0, softCap(d.critChance, 0.6, 0.75));
  // Crit multiplier: soft 3x, hard 5x.
  d.critMultiplier = Math.max(1, softCap(d.critMultiplier, 3, 5));
  // Dodge: soft 35%, hard 50%.
  d.dodge = Math.max(0, softCap(d.dodge, 0.35, 0.5));
  // Accuracy: 30% floor, 100% ceiling.
  d.accuracy = Math.max(0.3, Math.min(1, d.accuracy));
  // Block chance: soft 40%, hard 60%.
  d.blockChance = Math.max(0, softCap(d.blockChance, 0.4, 0.6));
  // Lifesteal: soft 15%, hard 25% (changed from 30 to be harsher).
  d.lifesteal = Math.max(0, softCap(d.lifesteal, 0.15, 0.25));
  // Speed: hard cap 200% (i.e. 100% bonus).
  d.speed = Math.max(0, Math.min(200, d.speed));
  // Resistances: floor -50%, soft 60%, hard 75% (already in range).
  for (const el of Object.keys(d.resistance) as ElementId[]) {
    const v = d.resistance[el] ?? 0;
    d.resistance[el] = Math.max(-0.5, softCap(v, 0.6, 0.75));
  }
  d.maxHp = Math.max(1, Math.round(d.maxHp));
  d.maxMana = Math.max(0, Math.round(d.maxMana));
}
