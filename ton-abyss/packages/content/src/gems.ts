import type { GemDef } from "@ton-abyss/shared";

// Gems: socketed into items. Color matters — gems matching slot color get 1.5x bonus.
export const GEMS: Record<string, GemDef> = {
  // ------ RED (offense) ------
  gem_ruby_t1: { id: "gem_ruby_t1", name: "Тусклый рубин", color: "red", tier: 1, anyBonus: { attack: 4 }, weaponBonus: { attack: 8 }, sellValue: 40 },
  gem_ruby_t2: { id: "gem_ruby_t2", name: "Рубин", color: "red", tier: 2, anyBonus: { attack: 10 }, weaponBonus: { attack: 18 }, sellValue: 220 },
  gem_ruby_t3: { id: "gem_ruby_t3", name: "Сияющий рубин", color: "red", tier: 3, anyBonus: { attack: 22 }, weaponBonus: { attack: 40, critChance: 0.02 }, sellValue: 980 },
  gem_ruby_t4: { id: "gem_ruby_t4", name: "Рубин пламени", color: "red", tier: 4, anyBonus: { attack: 48 }, weaponBonus: { attack: 90, critChance: 0.04, critMultiplier: 0.1 }, sellValue: 4400 },
  gem_ruby_t5: { id: "gem_ruby_t5", name: "Рубин Бездны", color: "red", tier: 5, anyBonus: { attack: 110 }, weaponBonus: { attack: 220, critChance: 0.06, critMultiplier: 0.2 }, sellValue: 18000 },

  // ------ BLUE (magic / mana) ------
  gem_sapphire_t1: { id: "gem_sapphire_t1", name: "Тусклый сапфир", color: "blue", tier: 1, anyBonus: { spellPower: 4 }, weaponBonus: { spellPower: 8, maxMana: 5 }, sellValue: 40 },
  gem_sapphire_t2: { id: "gem_sapphire_t2", name: "Сапфир", color: "blue", tier: 2, anyBonus: { spellPower: 10 }, weaponBonus: { spellPower: 18, maxMana: 10 }, sellValue: 220 },
  gem_sapphire_t3: { id: "gem_sapphire_t3", name: "Сияющий сапфир", color: "blue", tier: 3, anyBonus: { spellPower: 22 }, weaponBonus: { spellPower: 40, maxMana: 20 }, sellValue: 980 },
  gem_sapphire_t4: { id: "gem_sapphire_t4", name: "Сапфир глубин", color: "blue", tier: 4, anyBonus: { spellPower: 48, maxMana: 20 }, weaponBonus: { spellPower: 90, maxMana: 40 }, sellValue: 4400 },
  gem_sapphire_t5: { id: "gem_sapphire_t5", name: "Сапфир звёзд", color: "blue", tier: 5, anyBonus: { spellPower: 110, maxMana: 40 }, weaponBonus: { spellPower: 220, maxMana: 80, critChance: 0.04 }, sellValue: 18000 },

  // ------ GREEN (utility / luck / HP) ------
  gem_emerald_t1: { id: "gem_emerald_t1", name: "Тусклый изумруд", color: "green", tier: 1, anyBonus: { maxHp: 20 }, armorBonus: { maxHp: 40 }, sellValue: 40 },
  gem_emerald_t2: { id: "gem_emerald_t2", name: "Изумруд", color: "green", tier: 2, anyBonus: { maxHp: 50, luck: 2 }, armorBonus: { maxHp: 90, luck: 3 }, sellValue: 220 },
  gem_emerald_t3: { id: "gem_emerald_t3", name: "Сияющий изумруд", color: "green", tier: 3, anyBonus: { maxHp: 120, luck: 4 }, armorBonus: { maxHp: 220, luck: 6 }, sellValue: 980 },
  gem_emerald_t4: { id: "gem_emerald_t4", name: "Изумруд природы", color: "green", tier: 4, anyBonus: { maxHp: 260, luck: 8 }, armorBonus: { maxHp: 480, luck: 12 }, sellValue: 4400 },
  gem_emerald_t5: { id: "gem_emerald_t5", name: "Изумруд вечности", color: "green", tier: 5, anyBonus: { maxHp: 600, luck: 16 }, armorBonus: { maxHp: 1100, luck: 24 }, sellValue: 18000 },

  // ------ YELLOW (defense) ------
  gem_topaz_t1: { id: "gem_topaz_t1", name: "Тусклый топаз", color: "yellow", tier: 1, anyBonus: { defense: 4 }, armorBonus: { defense: 8, maxHp: 10 }, sellValue: 40 },
  gem_topaz_t2: { id: "gem_topaz_t2", name: "Топаз", color: "yellow", tier: 2, anyBonus: { defense: 10, blockChance: 0.01 }, armorBonus: { defense: 18, maxHp: 30, blockChance: 0.02 }, sellValue: 220 },
  gem_topaz_t3: { id: "gem_topaz_t3", name: "Сияющий топаз", color: "yellow", tier: 3, anyBonus: { defense: 22, blockChance: 0.02 }, armorBonus: { defense: 40, maxHp: 80, blockChance: 0.04 }, sellValue: 980 },
  gem_topaz_t4: { id: "gem_topaz_t4", name: "Топаз крепости", color: "yellow", tier: 4, anyBonus: { defense: 48, blockChance: 0.04 }, armorBonus: { defense: 90, maxHp: 180, blockChance: 0.07 }, sellValue: 4400 },
  gem_topaz_t5: { id: "gem_topaz_t5", name: "Топаз неукротимый", color: "yellow", tier: 5, anyBonus: { defense: 110, blockChance: 0.06, blockAmount: 20 }, armorBonus: { defense: 220, maxHp: 400, blockChance: 0.1, blockAmount: 40 }, sellValue: 18000 },

  // ------ PURPLE (crit) ------
  gem_amethyst_t1: { id: "gem_amethyst_t1", name: "Тусклый аметист", color: "purple", tier: 1, anyBonus: { critChance: 0.01 }, weaponBonus: { critChance: 0.02 }, sellValue: 60 },
  gem_amethyst_t2: { id: "gem_amethyst_t2", name: "Аметист", color: "purple", tier: 2, anyBonus: { critChance: 0.02, critMultiplier: 0.05 }, weaponBonus: { critChance: 0.04, critMultiplier: 0.08 }, sellValue: 300 },
  gem_amethyst_t3: { id: "gem_amethyst_t3", name: "Сияющий аметист", color: "purple", tier: 3, anyBonus: { critChance: 0.04, critMultiplier: 0.1 }, weaponBonus: { critChance: 0.07, critMultiplier: 0.18 }, sellValue: 1400 },
  gem_amethyst_t4: { id: "gem_amethyst_t4", name: "Аметист жажды", color: "purple", tier: 4, anyBonus: { critChance: 0.06, critMultiplier: 0.2 }, weaponBonus: { critChance: 0.1, critMultiplier: 0.3 }, sellValue: 6400 },
  gem_amethyst_t5: { id: "gem_amethyst_t5", name: "Аметист пророка", color: "purple", tier: 5, anyBonus: { critChance: 0.1, critMultiplier: 0.4 }, weaponBonus: { critChance: 0.15, critMultiplier: 0.6 }, sellValue: 24000 },

  // ------ WHITE (balanced / flex) ------
  gem_diamond_t1: { id: "gem_diamond_t1", name: "Тусклый алмаз", color: "white", tier: 1, anyBonus: { attack: 2, defense: 2, spellPower: 2 }, sellValue: 80 },
  gem_diamond_t2: { id: "gem_diamond_t2", name: "Алмаз", color: "white", tier: 2, anyBonus: { attack: 5, defense: 5, spellPower: 5, maxHp: 20 }, sellValue: 400 },
  gem_diamond_t3: { id: "gem_diamond_t3", name: "Сияющий алмаз", color: "white", tier: 3, anyBonus: { attack: 12, defense: 12, spellPower: 12, maxHp: 50, critChance: 0.02 }, sellValue: 1800 },
  gem_diamond_t4: { id: "gem_diamond_t4", name: "Совершенный алмаз", color: "white", tier: 4, anyBonus: { attack: 26, defense: 26, spellPower: 26, maxHp: 120, critChance: 0.03 }, sellValue: 7800 },
  gem_diamond_t5: { id: "gem_diamond_t5", name: "Звёздный алмаз", color: "white", tier: 5, anyBonus: { attack: 60, defense: 60, spellPower: 60, maxHp: 300, critChance: 0.05, critMultiplier: 0.2 }, sellValue: 32000 },
};

// Socket slot count by base item slot (default socket count when item drops).
export const DEFAULT_SOCKET_COUNT = {
  weapon: 2,
  offhand: 1,
  head: 1,
  chest: 2,
  legs: 1,
  hands: 1,
  feet: 1,
  ring: 1,
  amulet: 1,
  relic: 0,
} as const;
