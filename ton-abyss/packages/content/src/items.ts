import type { BaseItem } from "@ton-abyss/shared";

// Base items — level-gated. Rarity & affixes are rolled at drop time.
// Pattern: baseStats are the "blank" pre-affix floor for the slot.

export const ITEMS: Record<string, BaseItem> = {
  // ======== WEAPONS (one-hand) ========
  wpn_rusty_shortsword: {
    id: "wpn_rusty_shortsword",
    name: "Ржавый меч",
    slot: "weapon",
    weaponKind: "sword",
    levelReq: 1,
    baseStats: { attack: 5 },
    sellValue: 8,
    flavor: "Лезвие истории, тупое от времени.",
  },
  wpn_iron_sword: {
    id: "wpn_iron_sword",
    name: "Железный меч",
    slot: "weapon",
    weaponKind: "sword",
    levelReq: 5,
    baseStats: { attack: 12 },
    sellValue: 26,
  },
  wpn_steel_sword: {
    id: "wpn_steel_sword",
    name: "Стальной меч",
    slot: "weapon",
    weaponKind: "sword",
    levelReq: 12,
    baseStats: { attack: 24 },
    sellValue: 90,
  },
  wpn_abyssal_edge: {
    id: "wpn_abyssal_edge",
    name: "Клинок Бездны",
    slot: "weapon",
    weaponKind: "sword",
    levelReq: 40,
    baseStats: { attack: 78, critChance: 0.06 },
    sellValue: 4800,
    rarityWeight: { common: 0, uncommon: 0, rare: 100, epic: 60, legendary: 20, mythic: 5, abyssal: 1 },
    flavor: "Шёпот Бездны режет плоть и разум.",
  },
  wpn_hunters_bow: {
    id: "wpn_hunters_bow",
    name: "Охотничий лук",
    slot: "weapon",
    weaponKind: "bow",
    levelReq: 3,
    baseStats: { attack: 9, critChance: 0.03 },
    sellValue: 20,
  },
  wpn_tempest_bow: {
    id: "wpn_tempest_bow",
    name: "Лук Бурь",
    slot: "weapon",
    weaponKind: "bow",
    levelReq: 18,
    baseStats: { attack: 34, critChance: 0.05 },
    sellValue: 320,
  },
  wpn_novice_staff: {
    id: "wpn_novice_staff",
    name: "Посох ученика",
    slot: "weapon",
    weaponKind: "staff",
    twoHanded: true,
    levelReq: 1,
    baseStats: { spellPower: 7 },
    sellValue: 10,
  },
  wpn_arcane_staff: {
    id: "wpn_arcane_staff",
    name: "Посох чародея",
    slot: "weapon",
    weaponKind: "staff",
    twoHanded: true,
    levelReq: 10,
    baseStats: { spellPower: 20, maxMana: 15 },
    sellValue: 110,
  },
  wpn_void_tome: {
    id: "wpn_void_tome",
    name: "Фолиант Бездны",
    slot: "weapon",
    weaponKind: "tome",
    twoHanded: true,
    levelReq: 25,
    baseStats: { spellPower: 46, maxMana: 28 },
    rarityWeight: { common: 0, uncommon: 0, rare: 70, epic: 80, legendary: 30, mythic: 8, abyssal: 2 },
    sellValue: 1200,
  },
  wpn_beast_claws: {
    id: "wpn_beast_claws",
    name: "Когти зверя",
    slot: "weapon",
    weaponKind: "claw",
    levelReq: 4,
    baseStats: { attack: 10, critChance: 0.04 },
    sellValue: 24,
  },
  wpn_warhammer: {
    id: "wpn_warhammer",
    name: "Боевой молот",
    slot: "weapon",
    weaponKind: "mace",
    twoHanded: true,
    levelReq: 8,
    baseStats: { attack: 22, defense: 4 },
    sellValue: 75,
  },
  wpn_crypt_dagger: {
    id: "wpn_crypt_dagger",
    name: "Склеповый кинжал",
    slot: "weapon",
    weaponKind: "dagger",
    levelReq: 6,
    baseStats: { attack: 11, critChance: 0.08, critMultiplier: 0.15 },
    sellValue: 48,
  },

  // ======== OFFHANDS ========
  off_wooden_shield: { id: "off_wooden_shield", name: "Деревянный щит", slot: "offhand", levelReq: 1, baseStats: { defense: 4, blockChance: 0.04, blockAmount: 2 }, sellValue: 9 },
  off_kite_shield: { id: "off_kite_shield", name: "Каплевидный щит", slot: "offhand", levelReq: 10, baseStats: { defense: 10, blockChance: 0.08, blockAmount: 6 }, sellValue: 85 },
  off_aegis_of_dawn: { id: "off_aegis_of_dawn", name: "Эгида рассвета", slot: "offhand", levelReq: 30, baseStats: { defense: 24, blockChance: 0.12, blockAmount: 18, resistance: { physical: 0, fire: 0.1, frost: 0, shock: 0, void: 0, holy: 0.15 } }, sellValue: 2400, rarityWeight: { common: 0, uncommon: 0, rare: 60, epic: 80, legendary: 28, mythic: 6, abyssal: 1 } },
  off_focus_crystal: { id: "off_focus_crystal", name: "Кристалл фокуса", slot: "offhand", levelReq: 5, baseStats: { spellPower: 6, maxMana: 12 }, sellValue: 30 },
  off_abyss_orb: { id: "off_abyss_orb", name: "Сфера Бездны", slot: "offhand", levelReq: 22, baseStats: { spellPower: 24, maxMana: 28, critChance: 0.03 }, sellValue: 640 },

  // ======== ARMOR ========
  arm_leather_cap: { id: "arm_leather_cap", name: "Кожаная шапка", slot: "head", armorKind: "light", levelReq: 1, baseStats: { defense: 3, maxHp: 8 }, sellValue: 7 },
  arm_iron_helm: { id: "arm_iron_helm", name: "Железный шлем", slot: "head", armorKind: "heavy", levelReq: 6, baseStats: { defense: 8, maxHp: 16 }, sellValue: 38 },
  arm_runed_helm: { id: "arm_runed_helm", name: "Рунный шлем", slot: "head", armorKind: "medium", levelReq: 14, baseStats: { defense: 14, maxHp: 28, spellPower: 6 }, sellValue: 180 },
  arm_abyss_crown: { id: "arm_abyss_crown", name: "Корона Бездны", slot: "head", armorKind: "cloth", levelReq: 35, baseStats: { defense: 18, maxHp: 60, spellPower: 28, maxMana: 30 }, sellValue: 3200, rarityWeight: { common: 0, uncommon: 0, rare: 40, epic: 70, legendary: 30, mythic: 10, abyssal: 2 } },

  arm_leather_vest: { id: "arm_leather_vest", name: "Кожаный жилет", slot: "chest", armorKind: "light", levelReq: 1, baseStats: { defense: 6, maxHp: 20 }, sellValue: 12 },
  arm_chainmail: { id: "arm_chainmail", name: "Кольчуга", slot: "chest", armorKind: "medium", levelReq: 6, baseStats: { defense: 14, maxHp: 40 }, sellValue: 60 },
  arm_platemail: { id: "arm_platemail", name: "Латный доспех", slot: "chest", armorKind: "heavy", levelReq: 14, baseStats: { defense: 26, maxHp: 90 }, sellValue: 280 },
  arm_robe_of_runes: { id: "arm_robe_of_runes", name: "Одежды рун", slot: "chest", armorKind: "cloth", levelReq: 12, baseStats: { defense: 10, maxHp: 45, spellPower: 14, maxMana: 30 }, sellValue: 240 },
  arm_abyss_raiment: { id: "arm_abyss_raiment", name: "Одеяние Бездны", slot: "chest", armorKind: "cloth", levelReq: 34, baseStats: { defense: 28, maxHp: 140, spellPower: 36, maxMana: 55 }, sellValue: 4200, rarityWeight: { common: 0, uncommon: 0, rare: 40, epic: 70, legendary: 30, mythic: 10, abyssal: 2 } },

  arm_leather_legs: { id: "arm_leather_legs", name: "Кожаные штаны", slot: "legs", armorKind: "light", levelReq: 1, baseStats: { defense: 4, maxHp: 12 }, sellValue: 9 },
  arm_plate_legs: { id: "arm_plate_legs", name: "Латные поножи", slot: "legs", armorKind: "heavy", levelReq: 14, baseStats: { defense: 20, maxHp: 60 }, sellValue: 220 },
  arm_leather_gloves: { id: "arm_leather_gloves", name: "Кожаные перчатки", slot: "hands", armorKind: "light", levelReq: 1, baseStats: { defense: 2, critChance: 0.01 }, sellValue: 6 },
  arm_plate_gauntlets: { id: "arm_plate_gauntlets", name: "Латные рукавицы", slot: "hands", armorKind: "heavy", levelReq: 14, baseStats: { defense: 10, critChance: 0.02 }, sellValue: 180 },
  arm_leather_boots: { id: "arm_leather_boots", name: "Кожаные сапоги", slot: "feet", armorKind: "light", levelReq: 1, baseStats: { defense: 2, dodge: 0.01 }, sellValue: 6 },
  arm_plate_boots: { id: "arm_plate_boots", name: "Латные сапоги", slot: "feet", armorKind: "heavy", levelReq: 14, baseStats: { defense: 10 }, sellValue: 180 },

  // ======== TRINKETS ========
  tr_copper_ring: { id: "tr_copper_ring", name: "Медное кольцо", slot: "ring", levelReq: 1, baseStats: { maxHp: 6 }, sellValue: 8 },
  tr_ring_of_vigor: { id: "tr_ring_of_vigor", name: "Кольцо бодрости", slot: "ring", levelReq: 10, baseStats: { maxHp: 30, critChance: 0.02 }, sellValue: 120 },
  tr_amulet_of_dawn: { id: "tr_amulet_of_dawn", name: "Амулет рассвета", slot: "amulet", levelReq: 8, baseStats: { spellPower: 8, maxMana: 20 }, sellValue: 160 },
  tr_abyss_sigil: { id: "tr_abyss_sigil", name: "Печать Бездны", slot: "relic", levelReq: 28, baseStats: { critChance: 0.05, critMultiplier: 0.25, spellPower: 12 }, sellValue: 2200, rarityWeight: { common: 0, uncommon: 0, rare: 30, epic: 60, legendary: 30, mythic: 10, abyssal: 2 } },

  // ======== CONSUMABLES ========
  con_minor_hp_potion: { id: "con_minor_hp_potion", name: "Малое зелье лечения", slot: "consumable", levelReq: 1, stackable: true, maxStack: 20, sellValue: 5, flavor: "+60 HP" },
  con_hp_potion: { id: "con_hp_potion", name: "Зелье лечения", slot: "consumable", levelReq: 8, stackable: true, maxStack: 20, sellValue: 22, flavor: "+220 HP" },
  con_greater_hp_potion: { id: "con_greater_hp_potion", name: "Большое зелье лечения", slot: "consumable", levelReq: 20, stackable: true, maxStack: 20, sellValue: 80, flavor: "+780 HP" },
  con_mana_potion: { id: "con_mana_potion", name: "Зелье маны", slot: "consumable", levelReq: 4, stackable: true, maxStack: 20, sellValue: 12 },
  con_elixir_of_focus: { id: "con_elixir_of_focus", name: "Эликсир фокуса", slot: "consumable", levelReq: 10, stackable: true, maxStack: 5, sellValue: 120, flavor: "+20% крит. шанс на 3 хода" },
  con_elixir_of_iron: { id: "con_elixir_of_iron", name: "Эликсир железа", slot: "consumable", levelReq: 10, stackable: true, maxStack: 5, sellValue: 120, flavor: "+30% защита на 3 хода" },

  // ======== KEYS ========
  key_crypt: { id: "key_crypt", name: "Ключ склепа", slot: "key", levelReq: 1, stackable: true, maxStack: 50, sellValue: 0 },
  key_abyss: { id: "key_abyss", name: "Ключ Бездны", slot: "key", levelReq: 25, stackable: true, maxStack: 50, sellValue: 0 },

  // ======== RUNES ========
  rune_strength: { id: "rune_strength", name: "Руна силы", slot: "rune", levelReq: 5, stackable: true, maxStack: 10, baseStats: { attack: 6 }, sellValue: 60 },
  rune_flame: { id: "rune_flame", name: "Руна огня", slot: "rune", levelReq: 8, stackable: true, maxStack: 10, baseStats: { spellPower: 8 }, sellValue: 110 },
  rune_ward: { id: "rune_ward", name: "Руна защиты", slot: "rune", levelReq: 6, stackable: true, maxStack: 10, baseStats: { defense: 10 }, sellValue: 80 },

  // ======== PET EGGS ========
  egg_wyrmling: { id: "egg_wyrmling", name: "Яйцо дракончика", slot: "pet_egg", levelReq: 10, sellValue: 500 },
  egg_shade: { id: "egg_shade", name: "Яйцо тени", slot: "pet_egg", levelReq: 20, sellValue: 1800 },
};
