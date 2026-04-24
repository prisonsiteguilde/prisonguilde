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

  // ======== ADVANCED WEAPONS ========
  wpn_mithril_sword: { id: "wpn_mithril_sword", name: "Мифриловый меч", slot: "weapon", weaponKind: "sword", levelReq: 22, baseStats: { attack: 46, critChance: 0.04 }, sellValue: 620 },
  wpn_adamant_axe: { id: "wpn_adamant_axe", name: "Адамантовый топор", slot: "weapon", weaponKind: "axe", twoHanded: true, levelReq: 30, baseStats: { attack: 72, critMultiplier: 0.2 }, sellValue: 1800 },
  wpn_frost_mace: { id: "wpn_frost_mace", name: "Палица льда", slot: "weapon", weaponKind: "mace", levelReq: 16, baseStats: { attack: 30, defense: 6 }, sellValue: 280 },
  wpn_void_dagger: { id: "wpn_void_dagger", name: "Кинжал пустоты", slot: "weapon", weaponKind: "dagger", levelReq: 20, baseStats: { attack: 26, critChance: 0.12, critMultiplier: 0.25 }, sellValue: 520 },
  wpn_silver_bow: { id: "wpn_silver_bow", name: "Серебряный лук", slot: "weapon", weaponKind: "bow", levelReq: 10, baseStats: { attack: 22, critChance: 0.04 }, sellValue: 140 },
  wpn_ember_bow: { id: "wpn_ember_bow", name: "Лук углей", slot: "weapon", weaponKind: "bow", levelReq: 26, baseStats: { attack: 52, critChance: 0.08 }, sellValue: 1100 },
  wpn_holy_hammer: { id: "wpn_holy_hammer", name: "Священный молот", slot: "weapon", weaponKind: "mace", twoHanded: true, levelReq: 28, baseStats: { attack: 66, spellPower: 20, defense: 8 }, sellValue: 1400 },
  wpn_wand_of_frost: { id: "wpn_wand_of_frost", name: "Жезл стужи", slot: "weapon", weaponKind: "wand", levelReq: 8, baseStats: { spellPower: 16, maxMana: 10 }, sellValue: 70 },
  wpn_wand_of_shadow: { id: "wpn_wand_of_shadow", name: "Жезл тени", slot: "weapon", weaponKind: "wand", levelReq: 16, baseStats: { spellPower: 30, maxMana: 20 }, sellValue: 310 },
  wpn_staff_of_storms: { id: "wpn_staff_of_storms", name: "Посох бурь", slot: "weapon", weaponKind: "staff", twoHanded: true, levelReq: 20, baseStats: { spellPower: 38, maxMana: 25, critChance: 0.03 }, sellValue: 480 },
  wpn_celestial_staff: { id: "wpn_celestial_staff", name: "Небесный посох", slot: "weapon", weaponKind: "staff", twoHanded: true, levelReq: 32, baseStats: { spellPower: 62, maxMana: 40, critMultiplier: 0.2 }, sellValue: 2400 },
  wpn_feral_claws: { id: "wpn_feral_claws", name: "Одичалые когти", slot: "weapon", weaponKind: "claw", levelReq: 14, baseStats: { attack: 26, critChance: 0.08 }, sellValue: 220 },
  wpn_abyss_claws: { id: "wpn_abyss_claws", name: "Когти Бездны", slot: "weapon", weaponKind: "claw", levelReq: 32, baseStats: { attack: 60, critChance: 0.12, lifesteal: 0.08 }, sellValue: 2100 },
  wpn_titan_greatsword: { id: "wpn_titan_greatsword", name: "Титанский двуручник", slot: "weapon", weaponKind: "sword", twoHanded: true, levelReq: 38, baseStats: { attack: 104, defense: 12 }, sellValue: 4600, rarityWeight: { rare: 80, epic: 60, legendary: 22, mythic: 6, abyssal: 1 } },
  wpn_abyss_scythe: { id: "wpn_abyss_scythe", name: "Коса Бездны", slot: "weapon", weaponKind: "axe", twoHanded: true, levelReq: 45, baseStats: { attack: 128, critChance: 0.1, critMultiplier: 0.3 }, sellValue: 7800, rarityWeight: { rare: 40, epic: 60, legendary: 30, mythic: 10, abyssal: 3 } },
  wpn_tome_of_eternity: { id: "wpn_tome_of_eternity", name: "Фолиант вечности", slot: "weapon", weaponKind: "tome", twoHanded: true, levelReq: 48, baseStats: { spellPower: 130, maxMana: 80, critChance: 0.08 }, sellValue: 9200, rarityWeight: { epic: 60, legendary: 40, mythic: 12, abyssal: 4 } },

  // ======== ADVANCED OFFHANDS ========
  off_rune_buckler: { id: "off_rune_buckler", name: "Рунный баклер", slot: "offhand", levelReq: 18, baseStats: { defense: 16, blockChance: 0.1, blockAmount: 12, spellPower: 6 }, sellValue: 380 },
  off_tower_shield: { id: "off_tower_shield", name: "Башенный щит", slot: "offhand", levelReq: 25, baseStats: { defense: 22, blockChance: 0.16, blockAmount: 24 }, sellValue: 820 },
  off_spellbook: { id: "off_spellbook", name: "Гримуар заклинателя", slot: "offhand", levelReq: 12, baseStats: { spellPower: 14, maxMana: 24, critChance: 0.02 }, sellValue: 220 },
  off_abyss_codex: { id: "off_abyss_codex", name: "Кодекс Бездны", slot: "offhand", levelReq: 35, baseStats: { spellPower: 42, maxMana: 50, critChance: 0.06, critMultiplier: 0.15 }, sellValue: 3200, rarityWeight: { rare: 30, epic: 70, legendary: 30, mythic: 8, abyssal: 2 } },

  // ======== ADVANCED ARMOR (head) ========
  arm_mithril_helm: { id: "arm_mithril_helm", name: "Мифриловый шлем", slot: "head", armorKind: "medium", levelReq: 22, baseStats: { defense: 20, maxHp: 50, spellPower: 8 }, sellValue: 420 },
  arm_phoenix_hood: { id: "arm_phoenix_hood", name: "Капюшон феникса", slot: "head", armorKind: "cloth", levelReq: 28, baseStats: { defense: 14, maxHp: 40, spellPower: 28, resistance: { physical: 0, fire: 0.3, frost: 0, shock: 0, void: 0, holy: 0.1 } }, sellValue: 1600 },
  arm_warden_helm: { id: "arm_warden_helm", name: "Шлем Стража", slot: "head", armorKind: "heavy", levelReq: 20, baseStats: { defense: 22, maxHp: 60 }, sellValue: 380 },
  arm_celestial_circlet: { id: "arm_celestial_circlet", name: "Небесный венец", slot: "head", armorKind: "cloth", levelReq: 40, baseStats: { defense: 24, maxHp: 90, spellPower: 40, critChance: 0.04 }, sellValue: 4800, rarityWeight: { epic: 60, legendary: 30, mythic: 10, abyssal: 2 } },

  // ======== ADVANCED ARMOR (chest) ========
  arm_mithril_hauberk: { id: "arm_mithril_hauberk", name: "Мифриловая кольчуга", slot: "chest", armorKind: "medium", levelReq: 22, baseStats: { defense: 34, maxHp: 120 }, sellValue: 620 },
  arm_dragon_mail: { id: "arm_dragon_mail", name: "Драконья чешуя", slot: "chest", armorKind: "heavy", levelReq: 30, baseStats: { defense: 50, maxHp: 200, resistance: { physical: 0.05, fire: 0.3, frost: 0.1, shock: 0, void: 0, holy: 0 } }, sellValue: 2200 },
  arm_shadow_cowl: { id: "arm_shadow_cowl", name: "Теневой мантек", slot: "chest", armorKind: "light", levelReq: 26, baseStats: { defense: 22, maxHp: 80, dodge: 0.06, critChance: 0.03 }, sellValue: 1400 },
  arm_celestial_vestment: { id: "arm_celestial_vestment", name: "Небесное одеяние", slot: "chest", armorKind: "cloth", levelReq: 40, baseStats: { defense: 40, maxHp: 200, spellPower: 48, maxMana: 60 }, sellValue: 6400, rarityWeight: { epic: 60, legendary: 30, mythic: 10, abyssal: 2 } },

  // ======== LEGS / HANDS / FEET EXPANSION ========
  arm_mithril_legs: { id: "arm_mithril_legs", name: "Мифриловые поножи", slot: "legs", armorKind: "medium", levelReq: 22, baseStats: { defense: 26, maxHp: 80 }, sellValue: 420 },
  arm_shadow_pants: { id: "arm_shadow_pants", name: "Теневые штаны", slot: "legs", armorKind: "light", levelReq: 24, baseStats: { defense: 18, maxHp: 60, dodge: 0.05 }, sellValue: 680 },
  arm_adamant_legs: { id: "arm_adamant_legs", name: "Адамантовые поножи", slot: "legs", armorKind: "heavy", levelReq: 36, baseStats: { defense: 44, maxHp: 160 }, sellValue: 3200 },
  arm_mithril_gloves: { id: "arm_mithril_gloves", name: "Мифриловые перчатки", slot: "hands", armorKind: "medium", levelReq: 22, baseStats: { defense: 14, critChance: 0.04, attack: 6 }, sellValue: 340 },
  arm_shadow_gloves: { id: "arm_shadow_gloves", name: "Теневые перчатки", slot: "hands", armorKind: "light", levelReq: 24, baseStats: { defense: 10, critChance: 0.08, dodge: 0.02 }, sellValue: 520 },
  arm_sorcerer_gloves: { id: "arm_sorcerer_gloves", name: "Перчатки чародея", slot: "hands", armorKind: "cloth", levelReq: 22, baseStats: { defense: 8, spellPower: 14, maxMana: 16 }, sellValue: 320 },
  arm_mithril_boots: { id: "arm_mithril_boots", name: "Мифриловые сапоги", slot: "feet", armorKind: "medium", levelReq: 22, baseStats: { defense: 14, dodge: 0.02 }, sellValue: 320 },
  arm_shadow_boots: { id: "arm_shadow_boots", name: "Теневые сапоги", slot: "feet", armorKind: "light", levelReq: 24, baseStats: { defense: 10, dodge: 0.06, critChance: 0.02 }, sellValue: 480 },
  arm_sorcerer_slippers: { id: "arm_sorcerer_slippers", name: "Туфли чародея", slot: "feet", armorKind: "cloth", levelReq: 20, baseStats: { defense: 6, spellPower: 10, maxMana: 14 }, sellValue: 240 },

  // ======== ADVANCED TRINKETS ========
  tr_silver_ring: { id: "tr_silver_ring", name: "Серебряное кольцо", slot: "ring", levelReq: 8, baseStats: { maxHp: 18, critChance: 0.02 }, sellValue: 40 },
  tr_gold_ring: { id: "tr_gold_ring", name: "Золотое кольцо", slot: "ring", levelReq: 14, baseStats: { maxHp: 36, critChance: 0.03, spellPower: 4 }, sellValue: 160 },
  tr_mithril_ring: { id: "tr_mithril_ring", name: "Мифриловое кольцо", slot: "ring", levelReq: 22, baseStats: { maxHp: 60, critChance: 0.05, spellPower: 10 }, sellValue: 520 },
  tr_ring_of_kings: { id: "tr_ring_of_kings", name: "Королевское кольцо", slot: "ring", levelReq: 30, baseStats: { maxHp: 120, critChance: 0.08, spellPower: 20, attack: 10 }, sellValue: 2400, rarityWeight: { rare: 40, epic: 60, legendary: 20, mythic: 4, abyssal: 1 } },
  tr_ring_of_abyss: { id: "tr_ring_of_abyss", name: "Кольцо Бездны", slot: "ring", levelReq: 40, baseStats: { maxHp: 200, critChance: 0.12, spellPower: 40, attack: 20, lifesteal: 0.05 }, sellValue: 6400, rarityWeight: { epic: 50, legendary: 30, mythic: 10, abyssal: 3 } },
  tr_amulet_of_fortitude: { id: "tr_amulet_of_fortitude", name: "Амулет стойкости", slot: "amulet", levelReq: 14, baseStats: { maxHp: 80, defense: 10 }, sellValue: 260 },
  tr_amulet_of_flame: { id: "tr_amulet_of_flame", name: "Амулет пламени", slot: "amulet", levelReq: 20, baseStats: { spellPower: 18, resistance: { physical: 0, fire: 0.25, frost: -0.1, shock: 0, void: 0, holy: 0 } }, sellValue: 680 },
  tr_amulet_of_frost: { id: "tr_amulet_of_frost", name: "Амулет льда", slot: "amulet", levelReq: 20, baseStats: { spellPower: 18, resistance: { physical: 0, fire: -0.1, frost: 0.25, shock: 0, void: 0, holy: 0 } }, sellValue: 680 },
  tr_amulet_of_shadow: { id: "tr_amulet_of_shadow", name: "Амулет тени", slot: "amulet", levelReq: 24, baseStats: { spellPower: 26, resistance: { physical: 0, fire: 0, frost: 0, shock: 0, void: 0.3, holy: -0.15 }, critChance: 0.04 }, sellValue: 1200 },
  tr_amulet_of_abyss: { id: "tr_amulet_of_abyss", name: "Амулет Бездны", slot: "amulet", levelReq: 38, baseStats: { spellPower: 48, maxMana: 60, critMultiplier: 0.25, resistance: { physical: 0, fire: 0, frost: 0, shock: 0, void: 0.5, holy: -0.25 } }, sellValue: 5800, rarityWeight: { epic: 50, legendary: 30, mythic: 12, abyssal: 4 } },
  tr_relic_seal: { id: "tr_relic_seal", name: "Печать древнего", slot: "relic", levelReq: 18, baseStats: { critChance: 0.03, critMultiplier: 0.1, spellPower: 8 }, sellValue: 520 },
  tr_relic_orb: { id: "tr_relic_orb", name: "Сфера силы", slot: "relic", levelReq: 26, baseStats: { attack: 14, critChance: 0.04, critMultiplier: 0.15 }, sellValue: 1400 },
  tr_relic_soul: { id: "tr_relic_soul", name: "Реликвия души", slot: "relic", levelReq: 40, baseStats: { attack: 24, spellPower: 24, critChance: 0.06, critMultiplier: 0.3, lifesteal: 0.08 }, sellValue: 7800, rarityWeight: { epic: 40, legendary: 30, mythic: 14, abyssal: 5 } },

  // ======== CONSUMABLES EXPANSION ========
  con_elixir_of_might: { id: "con_elixir_of_might", name: "Эликсир мощи", slot: "consumable", levelReq: 15, stackable: true, maxStack: 5, sellValue: 160, flavor: "+30% атака на 3 хода" },
  con_elixir_of_mind: { id: "con_elixir_of_mind", name: "Эликсир разума", slot: "consumable", levelReq: 15, stackable: true, maxStack: 5, sellValue: 160, flavor: "+35% магия на 3 хода" },
  con_scroll_of_regen: { id: "con_scroll_of_regen", name: "Свиток регенерации", slot: "consumable", levelReq: 18, stackable: true, maxStack: 10, sellValue: 220 },
  con_scroll_of_haste: { id: "con_scroll_of_haste", name: "Свиток скорости", slot: "consumable", levelReq: 18, stackable: true, maxStack: 10, sellValue: 220 },
  con_scroll_of_shield: { id: "con_scroll_of_shield", name: "Свиток щита", slot: "consumable", levelReq: 12, stackable: true, maxStack: 10, sellValue: 140 },
  con_tincture_of_antitoxin: { id: "con_tincture_of_antitoxin", name: "Настой противоядия", slot: "consumable", levelReq: 10, stackable: true, maxStack: 10, sellValue: 80 },
  con_tincture_of_cleansing: { id: "con_tincture_of_cleansing", name: "Настой очищения", slot: "consumable", levelReq: 14, stackable: true, maxStack: 10, sellValue: 120 },
  con_draught_of_the_titan: { id: "con_draught_of_the_titan", name: "Напиток титана", slot: "consumable", levelReq: 30, stackable: true, maxStack: 3, sellValue: 480, flavor: "+50% HP и защита на 4 хода" },
  con_phoenix_feather_heal: { id: "con_phoenix_feather_heal", name: "Перо феникса (воскрешение)", slot: "consumable", levelReq: 30, stackable: true, maxStack: 3, sellValue: 900, flavor: "Воскрешает с 40% HP" },
  con_abyss_essence: { id: "con_abyss_essence", name: "Эссенция Бездны", slot: "consumable", levelReq: 40, stackable: true, maxStack: 3, sellValue: 1600, flavor: "+100% урон, +50% крит на 3 хода" },

  // ======== KEYS EXPANSION ========
  key_infernal: { id: "key_infernal", name: "Ключ Преисподней", slot: "key", levelReq: 15, stackable: true, maxStack: 50, sellValue: 0 },
  key_ice_sanctum: { id: "key_ice_sanctum", name: "Ключ ледяного святилища", slot: "key", levelReq: 12, stackable: true, maxStack: 50, sellValue: 0 },
  key_celestial: { id: "key_celestial", name: "Небесный ключ", slot: "key", levelReq: 32, stackable: true, maxStack: 50, sellValue: 0 },

  // ======== PET EGGS ========
  egg_wyrmling: { id: "egg_wyrmling", name: "Яйцо драконёнка", slot: "pet_egg", levelReq: 12, sellValue: 800, rarityWeight: { rare: 30, epic: 60, legendary: 8, mythic: 2, abyssal: 0 } },
  egg_shade: { id: "egg_shade", name: "Яйцо тени", slot: "pet_egg", levelReq: 18, sellValue: 1600, rarityWeight: { rare: 30, epic: 60, legendary: 8, mythic: 2, abyssal: 0 } },
  egg_golem_core: { id: "egg_golem_core", name: "Ядро голема", slot: "pet_egg", levelReq: 22, sellValue: 2400, rarityWeight: { rare: 20, epic: 60, legendary: 15, mythic: 4, abyssal: 1 } },
  egg_abyss: { id: "egg_abyss", name: "Яйцо из Бездны", slot: "pet_egg", levelReq: 38, sellValue: 9800, rarityWeight: { epic: 40, legendary: 40, mythic: 16, abyssal: 4 } },

  // ======== RUNES ========
  rune_strength: { id: "rune_strength", name: "Руна силы", slot: "rune", levelReq: 5, stackable: true, maxStack: 10, baseStats: { attack: 6 }, sellValue: 60 },
  rune_flame: { id: "rune_flame", name: "Руна огня", slot: "rune", levelReq: 8, stackable: true, maxStack: 10, baseStats: { spellPower: 8 }, sellValue: 110 },
  rune_ward: { id: "rune_ward", name: "Руна защиты", slot: "rune", levelReq: 6, stackable: true, maxStack: 10, baseStats: { defense: 10 }, sellValue: 80 },

};
