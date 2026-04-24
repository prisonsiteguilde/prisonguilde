import type { SkillNode } from "@ton-abyss/shared";

// 8 skill nodes per class × 4 classes = 32 total.
// Mix of passives (stat bonuses) and actives (unlock new abilities).
export const SKILLS: Record<string, SkillNode> = {
  // ======== WARDEN (tank/bruiser) ========
  sk_warden_t1_def: { id: "sk_warden_t1_def", classId: "warden", tier: 1, name: "Закалённая кожа", description: "+8 защиты за ранг.", maxRank: 5, kind: "passive", grants: { defense: 8 } },
  sk_warden_t1_vit: { id: "sk_warden_t1_vit", classId: "warden", tier: 1, name: "Неукротимый", description: "+50 HP за ранг.", maxRank: 5, kind: "passive", grants: { maxHp: 50 } },
  sk_warden_t2_shield: { id: "sk_warden_t2_shield", classId: "warden", tier: 2, name: "Стена щита", description: "Активный: на 2 хода -35% урона.", maxRank: 1, kind: "active", grantsAbility: "shield_wall", requires: ["sk_warden_t1_def"] },
  sk_warden_t2_thorns: { id: "sk_warden_t2_thorns", classId: "warden", tier: 2, name: "Шипы", description: "+5% урона возвращается атакующим за ранг.", maxRank: 4, kind: "passive", grants: { blockAmount: 4 }, requires: ["sk_warden_t1_vit"] },
  sk_warden_t3_fortress: { id: "sk_warden_t3_fortress", classId: "warden", tier: 3, name: "Крепость", description: "+12 защиты и +8% шанса блока за ранг.", maxRank: 3, kind: "passive", grants: { defense: 12, blockChance: 0.08 }, requires: ["sk_warden_t2_shield"] },
  sk_warden_t3_might: { id: "sk_warden_t3_might", classId: "warden", tier: 3, name: "Могучий удар", description: "Активный: удар с +40% уроном.", maxRank: 1, kind: "active", grantsAbility: "power_strike", requires: ["sk_warden_t2_thorns"] },
  sk_warden_t4_titan: { id: "sk_warden_t4_titan", classId: "warden", tier: 4, name: "Титан", description: "+200 HP и +4% вампиризма за ранг.", maxRank: 3, kind: "passive", grants: { maxHp: 200, lifesteal: 0.04 }, requires: ["sk_warden_t3_fortress"] },
  sk_warden_t4_guardian: { id: "sk_warden_t4_guardian", classId: "warden", tier: 4, name: "Страж Бездны", description: "Активный: провокация и регенерация.", maxRank: 1, kind: "active", grantsAbility: "rally_pet", requires: ["sk_warden_t3_might"] },

  // ======== RUNESMITH (caster) ========
  sk_rune_t1_spell: { id: "sk_rune_t1_spell", classId: "runesmith", tier: 1, name: "Магия рун", description: "+10 магии за ранг.", maxRank: 5, kind: "passive", grants: { spellPower: 10 } },
  sk_rune_t1_mana: { id: "sk_rune_t1_mana", classId: "runesmith", tier: 1, name: "Мана рун", description: "+15 маны за ранг.", maxRank: 5, kind: "passive", grants: { maxMana: 15 } },
  sk_rune_t2_bolt: { id: "sk_rune_t2_bolt", classId: "runesmith", tier: 2, name: "Молния рун", description: "Активный: магический разряд с шоком.", maxRank: 1, kind: "active", grantsAbility: "rune_bolt", requires: ["sk_rune_t1_spell"] },
  sk_rune_t2_ignite: { id: "sk_rune_t2_ignite", classId: "runesmith", tier: 2, name: "Руна пламени", description: "Активный: поджигает цель на 3 хода.", maxRank: 1, kind: "active", grantsAbility: "rune_ignite", requires: ["sk_rune_t1_mana"] },
  sk_rune_t3_focus: { id: "sk_rune_t3_focus", classId: "runesmith", tier: 3, name: "Фокус чародея", description: "+5% шанс крита и +15% крит. урона за ранг.", maxRank: 3, kind: "passive", grants: { critChance: 0.05, critMultiplier: 0.15 }, requires: ["sk_rune_t2_bolt"] },
  sk_rune_t3_elem: { id: "sk_rune_t3_elem", classId: "runesmith", tier: 3, name: "Стихийная мощь", description: "+20 магии и +8% ко всем резистам за ранг.", maxRank: 3, kind: "passive", grants: { spellPower: 20 }, requires: ["sk_rune_t2_ignite"] },
  sk_rune_t4_archmage: { id: "sk_rune_t4_archmage", classId: "runesmith", tier: 4, name: "Архимаг", description: "+60 магии, +80 маны за ранг.", maxRank: 3, kind: "passive", grants: { spellPower: 60, maxMana: 80 }, requires: ["sk_rune_t3_focus"] },
  sk_rune_t4_storm: { id: "sk_rune_t4_storm", classId: "runesmith", tier: 4, name: "Буря рун", description: "Активный: сильное AoE-заклинание.", maxRank: 1, kind: "active", grantsAbility: "void_curse", requires: ["sk_rune_t3_elem"] },

  // ======== VOIDCALLER (glass cannon / necromancer-ish) ========
  sk_void_t1_shadow: { id: "sk_void_t1_shadow", classId: "voidcaller", tier: 1, name: "Теневая связь", description: "+12 магии пустоты за ранг.", maxRank: 5, kind: "passive", grants: { spellPower: 12 } },
  sk_void_t1_dodge: { id: "sk_void_t1_dodge", classId: "voidcaller", tier: 1, name: "Скольжение", description: "+3% уклонение за ранг.", maxRank: 5, kind: "passive", grants: { dodge: 0.03 } },
  sk_void_t2_drain: { id: "sk_void_t2_drain", classId: "voidcaller", tier: 2, name: "Высасывание", description: "Активный: урон + 40% как лечение.", maxRank: 1, kind: "active", grantsAbility: "void_drain", requires: ["sk_void_t1_shadow"] },
  sk_void_t2_curse: { id: "sk_void_t2_curse", classId: "voidcaller", tier: 2, name: "Проклятие", description: "Активный: цель получает +15% урона.", maxRank: 1, kind: "active", grantsAbility: "void_curse", requires: ["sk_void_t1_dodge"] },
  sk_void_t3_vamp: { id: "sk_void_t3_vamp", classId: "voidcaller", tier: 3, name: "Вампиризм Бездны", description: "+6% вампиризма и +8% крит. шанса за ранг.", maxRank: 3, kind: "passive", grants: { lifesteal: 0.06, critChance: 0.08 }, requires: ["sk_void_t2_drain"] },
  sk_void_t3_mark: { id: "sk_void_t3_mark", classId: "voidcaller", tier: 3, name: "Метка Бездны", description: "+20% крит. урона за ранг.", maxRank: 3, kind: "passive", grants: { critMultiplier: 0.2 }, requires: ["sk_void_t2_curse"] },
  sk_void_t4_apex: { id: "sk_void_t4_apex", classId: "voidcaller", tier: 4, name: "Апостол Бездны", description: "+80 магии, +15% вампиризм, +20% уклонение за ранг.", maxRank: 3, kind: "passive", grants: { spellPower: 80, lifesteal: 0.15, dodge: 0.2 }, requires: ["sk_void_t3_vamp"] },
  sk_void_t4_annihil: { id: "sk_void_t4_annihil", classId: "voidcaller", tier: 4, name: "Аннигиляция", description: "Активный: мощный удар, прерывает цель.", maxRank: 1, kind: "active", grantsAbility: "lesser_heal", requires: ["sk_void_t3_mark"] },

  // ======== BEASTBOUND (hunter/pet master) ========
  sk_beast_t1_agi: { id: "sk_beast_t1_agi", classId: "beastbound", tier: 1, name: "Звериная ловкость", description: "+8 атаки и +2 скорости за ранг.", maxRank: 5, kind: "passive", grants: { attack: 8, speed: 2 } },
  sk_beast_t1_crit: { id: "sk_beast_t1_crit", classId: "beastbound", tier: 1, name: "Глаз охотника", description: "+3% крит. шанс за ранг.", maxRank: 5, kind: "passive", grants: { critChance: 0.03 } },
  sk_beast_t2_slash: { id: "sk_beast_t2_slash", classId: "beastbound", tier: 2, name: "Рассечение", description: "Активный: кровотечение на 3 хода.", maxRank: 1, kind: "active", grantsAbility: "beast_slash", requires: ["sk_beast_t1_agi"] },
  sk_beast_t2_rally: { id: "sk_beast_t2_rally", classId: "beastbound", tier: 2, name: "Клич зверя", description: "Активный: +25% скорости питомцу.", maxRank: 1, kind: "active", grantsAbility: "rally_pet", requires: ["sk_beast_t1_crit"] },
  sk_beast_t3_ferocity: { id: "sk_beast_t3_ferocity", classId: "beastbound", tier: 3, name: "Свирепость", description: "+15% крит. урона и +3 скорости за ранг.", maxRank: 3, kind: "passive", grants: { critMultiplier: 0.15, speed: 3 }, requires: ["sk_beast_t2_slash"] },
  sk_beast_t3_bond: { id: "sk_beast_t3_bond", classId: "beastbound", tier: 3, name: "Узы", description: "+20% урон питомца. +8 атаки за ранг.", maxRank: 3, kind: "passive", grants: { attack: 8 }, requires: ["sk_beast_t2_rally"] },
  sk_beast_t4_avatar: { id: "sk_beast_t4_avatar", classId: "beastbound", tier: 4, name: "Аватар зверя", description: "+40 атаки, +10% крит, +10% уклонение за ранг.", maxRank: 3, kind: "passive", grants: { attack: 40, critChance: 0.1, dodge: 0.1 }, requires: ["sk_beast_t3_ferocity"] },
  sk_beast_t4_pack: { id: "sk_beast_t4_pack", classId: "beastbound", tier: 4, name: "Вожак стаи", description: "Активный: вызов духа зверя.", maxRank: 1, kind: "active", grantsAbility: "power_strike", requires: ["sk_beast_t3_bond"] },
};

export function skillsByClass(classId: SkillNode["classId"]): SkillNode[] {
  return Object.values(SKILLS).filter((s) => s.classId === classId);
}
