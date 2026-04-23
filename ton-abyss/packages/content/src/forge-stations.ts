// Forge Stations — elemental crafting workbenches with rarity/element bonuses.
// Selecting an active station before crafting applies its modifiers.

import type { ElementId, RarityId } from "@ton-abyss/shared";

export interface ForgeStationDef {
  id: string;
  name: string;
  ru: string;
  description: string;
  element: ElementId | "none";
  iconColor: string; // hex
  glow: string; // hex (lower opacity halo)
  // Multiplicative bonus to rarityBias for upper rarities (≥ rare):
  rarityBoost: Partial<Record<RarityId, number>>;
  // Discount on goldCost (0..1) — e.g. 0.10 = 10% off
  goldDiscount: number;
  // Element-aligned items get extra +affixCount when crafted
  elementAffinityBonus: number; // 0..3
  // Unlock requirements
  unlockCost: { gold?: number; shards?: number; materials?: Record<string, number> };
  unlockedByDefault?: boolean;
  loreFlavor: string;
}

export const FORGE_STATIONS: Record<string, ForgeStationDef> = {
  neutral: {
    id: "neutral",
    name: "anvil",
    ru: "Походная наковальня",
    description: "Базовая кузница. Без бонусов, доступна сразу.",
    element: "none",
    iconColor: "#94a3b8",
    glow: "#64748b",
    rarityBoost: {},
    goldDiscount: 0,
    elementAffinityBonus: 0,
    unlockCost: {},
    unlockedByDefault: true,
    loreFlavor: "Старая наковальня кузнеца, с которой начинался каждый герой.",
  },
  pyre: {
    id: "pyre",
    name: "Pyre Forge",
    ru: "Горнило Пиры",
    description: "Огненная кузница. +25% к шансу epic+, +1 элементальный аффикс на огненных предметах, скидка 10%.",
    element: "fire",
    iconColor: "#f97316",
    glow: "#ea580c",
    rarityBoost: { epic: 1.25, legendary: 1.30, mythic: 1.20, abyssal: 1.10 },
    goldDiscount: 0.10,
    elementAffinityBonus: 1,
    unlockCost: { gold: 50000, shards: 80, materials: { mat_phoenix_feather: 5 } },
    loreFlavor: "Горнило, в котором куются клинки фениксов.",
  },
  glacier: {
    id: "glacier",
    name: "Glacier Anvil",
    ru: "Ледяная наковальня",
    description: "Стихия льда. +20% к редким+, +1 ледяной аффикс, +5% к шансу blocking-аффиксов.",
    element: "frost",
    iconColor: "#38bdf8",
    glow: "#0ea5e9",
    rarityBoost: { rare: 1.20, epic: 1.20, legendary: 1.25, mythic: 1.15 },
    goldDiscount: 0.08,
    elementAffinityBonus: 1,
    unlockCost: { gold: 45000, shards: 70, materials: { mat_mithril: 20 } },
    loreFlavor: "Высечена из вечного льда северных шахт.",
  },
  void: {
    id: "void",
    name: "Void Crucible",
    ru: "Тигель Бездны",
    description: "Бездна. +15% к мифик+, +2 теневых аффикса, шанс 5% удвоить выход.",
    element: "void",
    iconColor: "#a855f7",
    glow: "#9333ea",
    rarityBoost: { legendary: 1.20, mythic: 1.30, abyssal: 1.40 },
    goldDiscount: 0.05,
    elementAffinityBonus: 2,
    unlockCost: { gold: 200000, shards: 300, materials: { mat_abyss_shard: 20, mat_boss_soul: 5 } },
    loreFlavor: "Тигель, выкованный из самой Бездны. Шепчет имена тех, кого крафтил.",
  },
  storm: {
    id: "storm",
    name: "Storm Forge",
    ru: "Грозовая кузня",
    description: "Молнии. +25% к скоростным аффиксам, +1 affix-slot, скидка 12%.",
    element: "shock",
    iconColor: "#facc15",
    glow: "#eab308",
    rarityBoost: { rare: 1.15, epic: 1.30, legendary: 1.20 },
    goldDiscount: 0.12,
    elementAffinityBonus: 1,
    unlockCost: { gold: 75000, shards: 120, materials: { mat_phoenix_feather: 3, mat_mithril: 15 } },
    loreFlavor: "Зажжена ударом небесной молнии. Никогда не остывает.",
  },
  abyssal_anvil: {
    id: "abyssal_anvil",
    name: "Abyssal Anvil",
    ru: "Бездонная наковальня (T5)",
    description: "Финальный T5: только мифики и абиссальные. +50% к мифику, +30% к абиссальному. Доступ только после 200 крафтов.",
    element: "void",
    iconColor: "#f0abfc",
    glow: "#e879f9",
    rarityBoost: { mythic: 1.50, abyssal: 1.30 },
    goldDiscount: 0,
    elementAffinityBonus: 3,
    unlockCost: { gold: 500000, shards: 800, materials: { mat_adamant: 30, mat_boss_soul: 15, mat_abyss_shard: 50 } },
    loreFlavor: "Если вы дошли сюда — Бездна знает ваше имя.",
  },
};
