// Runewords — precise rune combinations socketed in any item of the right type = massive bonus.
import type { DerivedStats, ItemSlot } from "@ton-abyss/shared";

export interface RunewordDef {
  id: string;
  name: string;
  runeSequence: string[]; // material/rune ids in order
  slotRestriction?: ItemSlot[];
  minItemLevel?: number;
  bonus: Partial<DerivedStats>;
  elementalDamageBonus?: { element: "fire" | "frost" | "shock" | "void" | "holy"; amount: number };
  description: string;
  flavor?: string;
  lvlReq: number;
}

export const RUNEWORDS: Record<string, RunewordDef> = {
  rw_stealth: {
    id: "rw_stealth",
    name: "Призрак",
    runeSequence: ["rune_tal", "rune_eth"],
    slotRestriction: ["chest", "legs"],
    minItemLevel: 10,
    bonus: { dodge: 0.12, speed: 25 },
    description: "+12% уклонение, +25 скорость",
    flavor: "Тихий шаг — вторая жизнь.",
    lvlReq: 10,
  },
  rw_grief: {
    id: "rw_grief",
    name: "Скорбь",
    runeSequence: ["rune_eth", "rune_tir", "rune_lo"],
    slotRestriction: ["weapon"],
    minItemLevel: 20,
    bonus: { attack: 80, critChance: 0.1 },
    elementalDamageBonus: { element: "void", amount: 40 },
    description: "+80 атаки, +10% шанс крита, +40 void-урона",
    lvlReq: 20,
  },
  rw_fortitude: {
    id: "rw_fortitude",
    name: "Стойкость",
    runeSequence: ["rune_el", "rune_sol", "rune_dol", "rune_lo"],
    slotRestriction: ["chest"],
    minItemLevel: 25,
    bonus: { maxHp: 600, defense: 80, blockChance: 0.15 },
    description: "+600 HP, +80 защита, +15% блок",
    lvlReq: 25,
  },
  rw_enigma: {
    id: "rw_enigma",
    name: "Загадка",
    runeSequence: ["rune_jah", "rune_ith", "rune_ber"],
    slotRestriction: ["chest"],
    minItemLevel: 30,
    bonus: { maxMana: 400, spellPower: 120, maxHp: 300 },
    description: "+400 маны, +120 магии, +300 HP",
    lvlReq: 30,
  },
  rw_infinity: {
    id: "rw_infinity",
    name: "Бесконечность",
    runeSequence: ["rune_ber", "rune_mal", "rune_ber", "rune_ist"],
    slotRestriction: ["weapon"],
    minItemLevel: 35,
    bonus: { attack: 140, critMultiplier: 0.5 },
    elementalDamageBonus: { element: "shock", amount: 100 },
    description: "+140 атаки, +50% крит-множитель, +100 shock-урона",
    flavor: "Время перестаёт существовать. Остаётся только удар.",
    lvlReq: 35,
  },
  rw_breath: {
    id: "rw_breath",
    name: "Дыхание Умирающего",
    runeSequence: ["rune_vex", "rune_hel", "rune_el", "rune_eld"],
    slotRestriction: ["weapon"],
    minItemLevel: 40,
    bonus: { lifesteal: 0.2, attack: 100, speed: 40 },
    description: "+20% вампиризм, +100 атаки, +40 скорости",
    lvlReq: 40,
  },
  rw_chaos: {
    id: "rw_chaos",
    name: "Хаос",
    runeSequence: ["rune_fal", "rune_ohm", "rune_um"],
    slotRestriction: ["weapon"],
    minItemLevel: 28,
    bonus: { attack: 90, critChance: 0.15 },
    description: "+90 атаки, +15% крит",
    lvlReq: 28,
  },
  rw_spirit: {
    id: "rw_spirit",
    name: "Дух",
    runeSequence: ["rune_tal", "rune_thul", "rune_ort", "rune_amn"],
    slotRestriction: ["weapon", "offhand"],
    minItemLevel: 15,
    bonus: { spellPower: 80, maxMana: 200, critChance: 0.08 },
    description: "+80 магии, +200 маны, +8% крит",
    lvlReq: 15,
  },
  rw_call_to_arms: {
    id: "rw_call_to_arms",
    name: "Зов Оружия",
    runeSequence: ["rune_amn", "rune_ral", "rune_mal", "rune_ist", "rune_ohm"],
    slotRestriction: ["weapon"],
    minItemLevel: 32,
    bonus: { attack: 110, maxHp: 400, lifesteal: 0.1 },
    description: "+110 атаки, +400 HP, +10% вампиризм",
    lvlReq: 32,
  },
  rw_heart_of_oak: {
    id: "rw_heart_of_oak",
    name: "Сердце Дуба",
    runeSequence: ["rune_ko", "rune_vex", "rune_pul", "rune_thul"],
    slotRestriction: ["weapon", "offhand"],
    minItemLevel: 22,
    bonus: { spellPower: 100, maxMana: 300 },
    elementalDamageBonus: { element: "holy", amount: 50 },
    description: "+100 магии, +300 маны, +50 holy-урона",
    lvlReq: 22,
  },
  rw_silence: {
    id: "rw_silence",
    name: "Безмолвие",
    runeSequence: ["rune_dol", "rune_eld", "rune_hel", "rune_ist", "rune_tir", "rune_vex"],
    slotRestriction: ["weapon"],
    minItemLevel: 38,
    bonus: { attack: 150, accuracy: 0.15, critChance: 0.12 },
    description: "+150 атаки, +15% точность, +12% крит",
    lvlReq: 38,
  },
  rw_last_wish: {
    id: "rw_last_wish",
    name: "Последнее Желание",
    runeSequence: ["rune_jah", "rune_mal", "rune_jah", "rune_sur", "rune_jah", "rune_ber"],
    slotRestriction: ["weapon"],
    minItemLevel: 50,
    bonus: { attack: 220, critChance: 0.25, lifesteal: 0.3, critMultiplier: 0.7 },
    description: "+220 атаки, +25% крит, +30% вампиризм, +70% крит-множитель",
    flavor: "Последнее, что пожелает твой враг — чтобы ты не носил этот меч.",
    lvlReq: 50,
  },
};
