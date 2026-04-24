// Enchants — add elemental infusion / stat infusion to items.
import type { DerivedStats, ElementId, ItemSlot } from "@ton-abyss/shared";

export interface EnchantDef {
  id: string;
  name: string;
  description: string;
  slotRestriction: ItemSlot[];
  costGold: number;
  costDust: number;
  costMaterials?: { baseId: string; qty: number }[];
  bonus: Partial<DerivedStats>;
  elementalDamage?: { element: ElementId; amount: number };
  elementalResist?: { element: ElementId; amount: number };
  levelReq: number;
}

export const ENCHANTS: Record<string, EnchantDef> = {
  ench_sharpness: {
    id: "ench_sharpness",
    name: "Остроту",
    description: "+15 атаки, +3% крит",
    slotRestriction: ["weapon"],
    costGold: 500,
    costDust: 20,
    bonus: { attack: 15, critChance: 0.03 },
    levelReq: 5,
  },
  ench_burning: {
    id: "ench_burning",
    name: "Пламя",
    description: "+20 fire-урона",
    slotRestriction: ["weapon"],
    costGold: 800,
    costDust: 30,
    bonus: {},
    elementalDamage: { element: "fire", amount: 20 },
    levelReq: 8,
  },
  ench_frostbite: {
    id: "ench_frostbite",
    name: "Мороз",
    description: "+20 frost-урона, шанс заморозки",
    slotRestriction: ["weapon"],
    costGold: 800,
    costDust: 30,
    bonus: {},
    elementalDamage: { element: "frost", amount: 20 },
    levelReq: 8,
  },
  ench_storm: {
    id: "ench_storm",
    name: "Грозу",
    description: "+25 shock-урона",
    slotRestriction: ["weapon"],
    costGold: 1200,
    costDust: 40,
    bonus: {},
    elementalDamage: { element: "shock", amount: 25 },
    levelReq: 12,
  },
  ench_voidbite: {
    id: "ench_voidbite",
    name: "Бездну",
    description: "+35 void-урона, +5% крит",
    slotRestriction: ["weapon"],
    costGold: 2000,
    costDust: 60,
    bonus: { critChance: 0.05 },
    elementalDamage: { element: "void", amount: 35 },
    levelReq: 18,
  },
  ench_holyfire: {
    id: "ench_holyfire",
    name: "Свет",
    description: "+30 holy-урона, +20 HP",
    slotRestriction: ["weapon"],
    costGold: 1500,
    costDust: 50,
    bonus: { maxHp: 20 },
    elementalDamage: { element: "holy", amount: 30 },
    levelReq: 15,
  },
  ench_warding: {
    id: "ench_warding",
    name: "Оберег",
    description: "+5% всех резистов",
    slotRestriction: ["chest", "head", "legs"],
    costGold: 1800,
    costDust: 50,
    bonus: { resistance: { physical: 0.05, fire: 0.05, frost: 0.05, shock: 0.05, void: 0.05, holy: 0.05 } as any },
    levelReq: 12,
  },
  ench_vitality: {
    id: "ench_vitality",
    name: "Жизненная сила",
    description: "+80 HP",
    slotRestriction: ["chest", "head", "legs", "hands", "feet"],
    costGold: 600,
    costDust: 25,
    bonus: { maxHp: 80 },
    levelReq: 5,
  },
  ench_swiftness: {
    id: "ench_swiftness",
    name: "Быстроту",
    description: "+15 скорости, +3% уклонение",
    slotRestriction: ["feet", "legs", "hands"],
    costGold: 700,
    costDust: 25,
    bonus: { speed: 15, dodge: 0.03 },
    levelReq: 6,
  },
  ench_arcane: {
    id: "ench_arcane",
    name: "Эфир",
    description: "+25 магии, +60 маны",
    slotRestriction: ["weapon", "offhand"],
    costGold: 1000,
    costDust: 35,
    bonus: { spellPower: 25, maxMana: 60 },
    levelReq: 10,
  },
  ench_lifedrink: {
    id: "ench_lifedrink",
    name: "Кровопитие",
    description: "+10% вампиризм",
    slotRestriction: ["weapon"],
    costGold: 2500,
    costDust: 75,
    bonus: { lifesteal: 0.1 },
    levelReq: 18,
  },
  ench_fortress: {
    id: "ench_fortress",
    name: "Крепость",
    description: "+25 защита, +8% блок",
    slotRestriction: ["chest", "offhand"],
    costGold: 1400,
    costDust: 45,
    bonus: { defense: 25, blockChance: 0.08 },
    levelReq: 12,
  },
};
