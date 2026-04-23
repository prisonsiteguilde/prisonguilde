// Relics — permanent buffs earned from unique boss kills.
import type { DerivedStats } from "@ton-abyss/shared";

export interface RelicDef {
  id: string;
  name: string;
  description: string;
  sourceBossId: string;
  bonus: Partial<DerivedStats>;
  flavor?: string;
  icon?: string;
}

export const RELICS: Record<string, RelicDef> = {
  relic_crypt_kings_crown: {
    id: "relic_crypt_kings_crown",
    name: "Корона Крипт-короля",
    description: "+50 HP, +5 защита",
    sourceBossId: "boss_crypt_knight",
    bonus: { maxHp: 50, defense: 5 },
    icon: "👑",
    flavor: "Корона из костей забытых королей.",
  },
  relic_frost_heart: {
    id: "relic_frost_heart",
    name: "Сердце Ледяного Змея",
    description: "+8% frost-резист, +20 HP",
    sourceBossId: "boss_frost_wyrm",
    bonus: { maxHp: 20, resistance: { physical: 0, fire: 0, frost: 0.08, shock: 0, void: 0, holy: 0 } as any },
    icon: "❄️",
  },
  relic_flame_eye: {
    id: "relic_flame_eye",
    name: "Огненное Око",
    description: "+8% fire-резист, +5% крит",
    sourceBossId: "boss_infernal_lord",
    bonus: { critChance: 0.05, resistance: { physical: 0, fire: 0.08, frost: 0, shock: 0, void: 0, holy: 0 } as any },
    icon: "👁️‍🗨️",
  },
  relic_void_stone: {
    id: "relic_void_stone",
    name: "Камень Бездны",
    description: "+15 магии, +10% void-резист, +30 маны",
    sourceBossId: "boss_abyss_titan",
    bonus: { spellPower: 15, maxMana: 30, resistance: { physical: 0, fire: 0, frost: 0, shock: 0, void: 0.1, holy: 0 } as any },
    icon: "🔮",
    flavor: "Пульсирует в такт шёпота Бездны.",
  },
};
