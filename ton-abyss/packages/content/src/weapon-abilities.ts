// Weapon-locked abilities. Registered into ABILITIES via expansion side-effect.
// Naming convention: wsk_{kind}_{name}

import type { AbilityDef } from "@ton-abyss/shared";
import { ABILITIES } from "./abilities.js";

const WEAPON_ABILITIES: Record<string, AbilityDef> = {
  // ============ SWORD ============
  wsk_sword_slash:    { id: "wsk_sword_slash",    name: "Стремительный рез",      kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 14, scaling: { attack: 1.05 }, targets: "enemy", description: "Базовый быстрый удар мечом." },
  wsk_sword_riposte:  { id: "wsk_sword_riposte",  name: "Контрудар",              kind: "attack",  element: "physical", manaCost: 8,  cooldown: 3, baseDamage: 28, scaling: { attack: 1.3 }, targets: "enemy", description: "Контратака после успешного парирования." },
  wsk_sword_whirl:    { id: "wsk_sword_whirl",    name: "Вихрь клинка",           kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 22, scaling: { attack: 1.2 }, aoe: true, targets: "all_enemies", description: "Удар по всем противникам в радиусе." },
  wsk_sword_pierce:   { id: "wsk_sword_pierce",   name: "Пробивающий выпад",      kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 36, scaling: { attack: 1.55 }, targets: "enemy", description: "Игнорирует 50% брони цели." },
  wsk_sword_execute:  { id: "wsk_sword_execute",  name: "Казнь",                  kind: "attack",  element: "physical", manaCost: 25, cooldown: 8, baseDamage: 60, scaling: { attack: 2.4 }, targets: "enemy", description: "Тройной урон по цели с HP < 25%." },

  // ============ GREATSWORD ============
  wsk_gs_cleave:      { id: "wsk_gs_cleave",      name: "Раскол",                 kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 22, scaling: { attack: 1.2 }, targets: "enemy", description: "Тяжёлый размашистый удар." },
  wsk_gs_smash:       { id: "wsk_gs_smash",       name: "Сокрушение",             kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 48, scaling: { attack: 1.8 }, targets: "enemy", description: "Мощный удар сверху, оглушение." },
  wsk_gs_overhead:    { id: "wsk_gs_overhead",    name: "Удар сверху",            kind: "attack",  element: "physical", manaCost: 18, cooldown: 4, baseDamage: 60, scaling: { attack: 2.0 }, targets: "enemy", description: "Удар сверху с пробитием брони." },
  wsk_gs_devastate:   { id: "wsk_gs_devastate",   name: "Опустошение",            kind: "attack",  element: "physical", manaCost: 25, cooldown: 5, baseDamage: 50, scaling: { attack: 1.8 }, aoe: true, targets: "all_enemies", description: "Удар по всем врагам с шансом критического урона." },
  wsk_gs_grand_finale:{ id: "wsk_gs_grand_finale",name: "Финальный гром",         kind: "attack",  element: "physical", manaCost: 40, cooldown: 10, baseDamage: 120, scaling: { attack: 3.0 }, targets: "enemy", description: "Финальный удар. Огромный урон, требует подзарядки." },

  // ============ AXE ============
  wsk_axe_chop:       { id: "wsk_axe_chop",       name: "Раздирающий рубящий",    kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 16, scaling: { attack: 1.1 }, targets: "enemy", description: "Базовый удар с шансом кровотечения.", effects: [{ id: "bleed", duration: 2, potency: 4 }] },
  wsk_axe_rend:       { id: "wsk_axe_rend",       name: "Разрывание",             kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 28, scaling: { attack: 1.3 }, targets: "enemy", description: "Накладывает сильное кровотечение.", effects: [{ id: "bleed", duration: 4, potency: 12 }] },
  wsk_axe_bloodthirst:{ id: "wsk_axe_bloodthirst",name: "Жажда крови",            kind: "buff",    element: "physical", manaCost: 18, cooldown: 6, targets: "self", description: "+30% вампиризма на 4 хода.", effects: [{ id: "haste", duration: 4, potency: 30 }] },
  wsk_axe_throw:      { id: "wsk_axe_throw",      name: "Метание",                kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 38, scaling: { attack: 1.6 }, targets: "enemy", description: "Бросает топор на расстояние с высоким уроном." },
  wsk_axe_butcher:    { id: "wsk_axe_butcher",    name: "Мясник",                 kind: "attack",  element: "physical", manaCost: 30, cooldown: 8, baseDamage: 50, scaling: { attack: 2.0 }, targets: "enemy", description: "Серия из 3 ударов, каждый накладывает кровотечение.", effects: [{ id: "bleed", duration: 3, potency: 15 }] },

  // ============ HAMMER ============
  wsk_hammer_bash:    { id: "wsk_hammer_bash",    name: "Сокрушающий молот",      kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 24, scaling: { attack: 1.25 }, targets: "enemy", description: "Тяжёлый удар, шанс оглушить.", effects: [{ id: "stun", duration: 1, potency: 0 }] },
  wsk_hammer_quake:   { id: "wsk_hammer_quake",   name: "Землетрясение",          kind: "attack",  element: "physical", manaCost: 16, cooldown: 4, baseDamage: 32, scaling: { attack: 1.4 }, aoe: true, targets: "all_enemies", description: "Удар по земле, урон по всем врагам." },
  wsk_hammer_stun:    { id: "wsk_hammer_stun",    name: "Оглушающий удар",        kind: "attack",  element: "physical", manaCost: 20, cooldown: 5, baseDamage: 40, scaling: { attack: 1.6 }, targets: "enemy", description: "Гарантированно оглушает на 2 хода.", effects: [{ id: "stun", duration: 2, potency: 0 }] },
  wsk_hammer_judgement:{ id: "wsk_hammer_judgement", name: "Суд",                 kind: "attack",  element: "holy", manaCost: 25, cooldown: 6, baseDamage: 70, scaling: { attack: 2.0 }, targets: "enemy", description: "Удар светом, дополнительный урон по нежити." },
  wsk_hammer_meteor:  { id: "wsk_hammer_meteor",  name: "Метеор",                 kind: "attack",  element: "fire", manaCost: 35, cooldown: 9, baseDamage: 80, scaling: { attack: 2.5 }, aoe: true, targets: "all_enemies", description: "Призывает метеор, поражающий всех врагов огнём.", effects: [{ id: "burn", duration: 3, potency: 10 }] },

  // ============ MACE ============
  wsk_mace_strike:    { id: "wsk_mace_strike",    name: "Дробящий удар",          kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 18, scaling: { attack: 1.15 }, targets: "enemy", description: "Простой удар булавой." },
  wsk_mace_consecrate:{ id: "wsk_mace_consecrate", name: "Освящение",             kind: "buff",    element: "holy", manaCost: 16, cooldown: 5, targets: "self", description: "+25% урона светом на 4 хода.", effects: [{ id: "fortify", duration: 4, potency: 25 }] },
  wsk_mace_shield_smash:{ id: "wsk_mace_shield_smash", name: "Удар щитом",        kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 28, scaling: { attack: 1.3 }, targets: "enemy", description: "Удар щитом, оглушает и снижает защиту.", effects: [{ id: "stun", duration: 1, potency: 0 }, { id: "weakness", duration: 3, potency: 20 }] },
  wsk_mace_holy_light:{ id: "wsk_mace_holy_light", name: "Святой свет",           kind: "heal",    element: "holy", manaCost: 22, cooldown: 6, baseDamage: 35, scaling: { spellPower: 1.0 }, targets: "self", description: "Восстанавливает HP, временный щит." },
  wsk_mace_purge:     { id: "wsk_mace_purge",     name: "Очищение",               kind: "spell",   element: "holy", manaCost: 28, cooldown: 7, baseDamage: 60, scaling: { attack: 1.5, spellPower: 1.0 }, targets: "enemy", description: "Очищает врага от баффов и наносит свет." },

  // ============ DAGGER ============
  wsk_dagger_jab:     { id: "wsk_dagger_jab",     name: "Точный укол",            kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 10, scaling: { attack: 0.9 }, targets: "enemy", description: "Быстрый укол с высокой скоростью." },
  wsk_dagger_poison_strike:{ id: "wsk_dagger_poison_strike", name: "Ядовитый удар", kind: "attack", element: "void", manaCost: 10, cooldown: 3, baseDamage: 16, scaling: { attack: 1.1 }, targets: "enemy", description: "Накладывает яд.", effects: [{ id: "poison", duration: 5, potency: 12 }] },
  wsk_dagger_backstab:{ id: "wsk_dagger_backstab", name: "Удар в спину",          kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 40, scaling: { attack: 1.8 }, targets: "enemy", description: "Огромный крит, если враг под эффектом." },
  wsk_dagger_flurry:  { id: "wsk_dagger_flurry",  name: "Шквал клинков",          kind: "attack",  element: "physical", manaCost: 20, cooldown: 5, baseDamage: 18, scaling: { attack: 0.6 }, targets: "enemy", description: "5 быстрых ударов подряд." },
  wsk_dagger_assassinate:{ id: "wsk_dagger_assassinate", name: "Казнь убийцы",    kind: "attack",  element: "physical", manaCost: 35, cooldown: 9, baseDamage: 80, scaling: { attack: 3.0 }, targets: "enemy", description: "Мгновенное убийство при HP < 30%." },

  // ============ SPEAR ============
  wsk_spear_thrust:   { id: "wsk_spear_thrust",   name: "Прокол",                 kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 16, scaling: { attack: 1.1 }, targets: "enemy", description: "Прямой колющий удар." },
  wsk_spear_sweep:    { id: "wsk_spear_sweep",    name: "Размах",                 kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 24, scaling: { attack: 1.2 }, aoe: true, targets: "all_enemies", description: "Размах копьём по всем врагам." },
  wsk_spear_impale:   { id: "wsk_spear_impale",   name: "Пронзание",              kind: "attack",  element: "physical", manaCost: 18, cooldown: 4, baseDamage: 50, scaling: { attack: 1.9 }, targets: "enemy", description: "Глубокий укол, кровотечение.", effects: [{ id: "bleed", duration: 4, potency: 10 }] },
  wsk_spear_phalanx:  { id: "wsk_spear_phalanx",  name: "Фаланга",                kind: "buff",    element: "physical", manaCost: 22, cooldown: 6, targets: "self", description: "+50% защиты, контратака на каждый удар.", effects: [{ id: "fortify", duration: 4, potency: 50 }] },
  wsk_spear_skewer:   { id: "wsk_spear_skewer",   name: "Шашлык",                 kind: "attack",  element: "physical", manaCost: 30, cooldown: 7, baseDamage: 75, scaling: { attack: 2.5 }, targets: "enemy", description: "Цепной удар через несколько целей." },

  // ============ BOW ============
  wsk_bow_shot:       { id: "wsk_bow_shot",       name: "Точный выстрел",         kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 14, scaling: { attack: 1.0 }, targets: "enemy", description: "Базовый дальнобойный выстрел." },
  wsk_bow_volley:     { id: "wsk_bow_volley",     name: "Залп",                   kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 18, scaling: { attack: 0.8 }, aoe: true, targets: "all_enemies", description: "Залп стрел по всем врагам." },
  wsk_bow_piercing:   { id: "wsk_bow_piercing",   name: "Пронзающий выстрел",     kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 36, scaling: { attack: 1.6 }, targets: "enemy", description: "Игнорирует 60% брони." },
  wsk_bow_explosive:  { id: "wsk_bow_explosive",  name: "Взрывная стрела",        kind: "attack",  element: "fire", manaCost: 20, cooldown: 5, baseDamage: 45, scaling: { attack: 1.7 }, aoe: true, targets: "all_enemies", description: "Взрывной снаряд, накладывает горение.", effects: [{ id: "burn", duration: 3, potency: 8 }] },
  wsk_bow_rain_arrows:{ id: "wsk_bow_rain_arrows", name: "Дождь стрел",           kind: "attack",  element: "physical", manaCost: 35, cooldown: 9, baseDamage: 30, scaling: { attack: 1.0 }, aoe: true, targets: "all_enemies", description: "Многократный обстрел всех врагов." },

  // ============ CROSSBOW ============
  wsk_xbow_bolt:      { id: "wsk_xbow_bolt",      name: "Болт",                   kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 22, scaling: { attack: 1.2 }, targets: "enemy", description: "Тяжёлый болт с большим уроном." },
  wsk_xbow_heavy_bolt:{ id: "wsk_xbow_heavy_bolt", name: "Тяжёлый болт",          kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 42, scaling: { attack: 1.7 }, targets: "enemy", description: "Усиленный болт с пробитием." },
  wsk_xbow_pinning:   { id: "wsk_xbow_pinning",   name: "Пригвождение",           kind: "attack",  element: "physical", manaCost: 16, cooldown: 5, baseDamage: 30, scaling: { attack: 1.3 }, targets: "enemy", description: "Прижимает врага к земле, обездвиживая.", effects: [{ id: "root", duration: 2, potency: 0 }] },
  wsk_xbow_siege_shot:{ id: "wsk_xbow_siege_shot", name: "Осадный выстрел",       kind: "attack",  element: "physical", manaCost: 25, cooldown: 6, baseDamage: 70, scaling: { attack: 2.2 }, targets: "enemy", description: "Сокрушительный выстрел." },
  wsk_xbow_executioner:{ id: "wsk_xbow_executioner", name: "Палач",               kind: "attack",  element: "physical", manaCost: 35, cooldown: 9, baseDamage: 100, scaling: { attack: 3.0 }, targets: "enemy", description: "Гарантированный крит, тройной урон по элите." },

  // ============ STAFF ============
  wsk_staff_bolt:     { id: "wsk_staff_bolt",     name: "Магический снаряд",      kind: "spell",   element: "fire", manaCost: 4,  cooldown: 0, baseDamage: 14, scaling: { spellPower: 1.0 }, targets: "enemy", description: "Базовый магический снаряд." },
  wsk_staff_fireball: { id: "wsk_staff_fireball", name: "Огненный шар",           kind: "spell",   element: "fire", manaCost: 14, cooldown: 3, baseDamage: 40, scaling: { spellPower: 1.4 }, aoe: true, targets: "all_enemies", description: "Взрывной огненный шар, поджигает.", effects: [{ id: "burn", duration: 3, potency: 8 }] },
  wsk_staff_chain_lightning:{ id: "wsk_staff_chain_lightning", name: "Цепная молния", kind: "spell", element: "shock", manaCost: 18, cooldown: 4, baseDamage: 35, scaling: { spellPower: 1.3 }, aoe: true, targets: "all_enemies", description: "Молния, скачущая между врагами." },
  wsk_staff_meteor:   { id: "wsk_staff_meteor",   name: "Метеор",                 kind: "spell",   element: "fire", manaCost: 30, cooldown: 7, baseDamage: 80, scaling: { spellPower: 2.0 }, aoe: true, targets: "all_enemies", description: "Призывает метеор. Огромный урон, поджигает.", effects: [{ id: "burn", duration: 4, potency: 15 }] },
  wsk_staff_arcane_storm:{ id: "wsk_staff_arcane_storm", name: "Аркановая буря",  kind: "spell",   element: "void", manaCost: 45, cooldown: 10, baseDamage: 120, scaling: { spellPower: 2.8 }, aoe: true, targets: "all_enemies", description: "Финальная атака посоха." },

  // ============ WAND ============
  wsk_wand_zap:       { id: "wsk_wand_zap",       name: "Разряд",                 kind: "spell",   element: "shock", manaCost: 3,  cooldown: 0, baseDamage: 12, scaling: { spellPower: 0.9 }, targets: "enemy", description: "Быстрый магический разряд." },
  wsk_wand_arcane_missile:{ id: "wsk_wand_arcane_missile", name: "Аркановая ракета", kind: "spell", element: "void", manaCost: 12, cooldown: 3, baseDamage: 28, scaling: { spellPower: 1.2 }, targets: "enemy", description: "Точечный магический удар с шансом критики." },
  wsk_wand_drain:     { id: "wsk_wand_drain",     name: "Высасывание",            kind: "spell",   element: "void", manaCost: 14, cooldown: 4, baseDamage: 22, scaling: { spellPower: 1.0 }, targets: "enemy", description: "Высасывает HP врага и передаёт магу." },
  wsk_wand_enfeeble:  { id: "wsk_wand_enfeeble",  name: "Ослабление",             kind: "debuff",  element: "void", manaCost: 16, cooldown: 5, targets: "enemy", description: "Снижает урон врага на 30% на 4 хода.", effects: [{ id: "weakness", duration: 4, potency: 30 }] },
  wsk_wand_obliterate:{ id: "wsk_wand_obliterate", name: "Уничтожение",           kind: "spell",   element: "void", manaCost: 30, cooldown: 8, baseDamage: 90, scaling: { spellPower: 2.5 }, targets: "enemy", description: "Колоссальный магический удар." },

  // ============ TOME ============
  wsk_tome_curse:     { id: "wsk_tome_curse",     name: "Проклятие",              kind: "debuff",  element: "void", manaCost: 8,  cooldown: 0, targets: "enemy", description: "Цель получает дополнительный урон от всех источников.", effects: [{ id: "curse", duration: 4, potency: 25 }] },
  wsk_tome_void_bolt: { id: "wsk_tome_void_bolt", name: "Снаряд бездны",          kind: "spell",   element: "void", manaCost: 12, cooldown: 2, baseDamage: 28, scaling: { spellPower: 1.2 }, targets: "enemy", description: "Тёмный снаряд из пустоты." },
  wsk_tome_summon_imp:{ id: "wsk_tome_summon_imp", name: "Призыв беса",           kind: "summon",  element: "void", manaCost: 25, cooldown: 8, targets: "self", description: "Призывает беса на 5 ходов." },
  wsk_tome_soul_drain:{ id: "wsk_tome_soul_drain", name: "Кража души",            kind: "spell",   element: "void", manaCost: 22, cooldown: 6, baseDamage: 40, scaling: { spellPower: 1.5 }, targets: "enemy", description: "Высасывает 50% урона как HP." },
  wsk_tome_apocalypse:{ id: "wsk_tome_apocalypse", name: "Апокалипсис",           kind: "spell",   element: "void", manaCost: 50, cooldown: 12, baseDamage: 150, scaling: { spellPower: 3.0 }, aoe: true, targets: "all_enemies", description: "Финальный закл. Огромный урон по площади." },

  // ============ CLAW ============
  wsk_claw_swipe:     { id: "wsk_claw_swipe",     name: "Когтистый удар",         kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 12, scaling: { attack: 1.0 }, targets: "enemy", description: "Двойной удар когтями." },
  wsk_claw_lacerate:  { id: "wsk_claw_lacerate",  name: "Раздирание",             kind: "attack",  element: "physical", manaCost: 10, cooldown: 3, baseDamage: 24, scaling: { attack: 1.2 }, targets: "enemy", description: "Глубокая рана.", effects: [{ id: "bleed", duration: 4, potency: 8 }] },
  wsk_claw_pounce:    { id: "wsk_claw_pounce",    name: "Прыжок",                 kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 32, scaling: { attack: 1.5 }, targets: "enemy", description: "Прыжок с молниеносной атакой." },
  wsk_claw_savage:    { id: "wsk_claw_savage",    name: "Дикий натиск",           kind: "attack",  element: "physical", manaCost: 22, cooldown: 5, baseDamage: 40, scaling: { attack: 1.4 }, targets: "enemy", description: "Серия из 4 ударов." },
  wsk_claw_blood_frenzy:{ id: "wsk_claw_blood_frenzy", name: "Кровавая ярость",   kind: "buff",    element: "physical", manaCost: 30, cooldown: 8, targets: "self", description: "+50% скорости атаки и +25% вампиризма на 5 ходов.", effects: [{ id: "haste", duration: 5, potency: 50 }] },

  // ============ SCYTHE ============
  wsk_scythe_reap:    { id: "wsk_scythe_reap",    name: "Жатва",                  kind: "attack",  element: "void", manaCost: 0,  cooldown: 0, baseDamage: 20, scaling: { attack: 1.15 }, targets: "enemy", description: "Размашистый удар косой." },
  wsk_scythe_soul_harvest:{ id: "wsk_scythe_soul_harvest", name: "Жатва душ",     kind: "attack",  element: "void", manaCost: 18, cooldown: 4, baseDamage: 35, scaling: { attack: 1.4 }, aoe: true, targets: "all_enemies", description: "Удар по всем, восстанавливает HP." },
  wsk_scythe_death_grip:{ id: "wsk_scythe_death_grip", name: "Хватка смерти",     kind: "debuff",  element: "void", manaCost: 14, cooldown: 4, targets: "enemy", description: "Притягивает врага и снижает его защиту.", effects: [{ id: "weakness", duration: 4, potency: 35 }] },
  wsk_scythe_eclipse: { id: "wsk_scythe_eclipse", name: "Затмение",               kind: "spell",   element: "void", manaCost: 25, cooldown: 6, baseDamage: 60, scaling: { spellPower: 1.6 }, aoe: true, targets: "all_enemies", description: "Тьма поглощает врагов." },
  wsk_scythe_oblivion:{ id: "wsk_scythe_oblivion", name: "Забвение",              kind: "spell",   element: "void", manaCost: 40, cooldown: 10, baseDamage: 130, scaling: { attack: 2.0, spellPower: 1.5 }, targets: "enemy", description: "Финальный удар косы. Может казнить врага." },

  // ============ RAPIER ============
  wsk_rapier_lunge:   { id: "wsk_rapier_lunge",   name: "Выпад",                  kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 12, scaling: { attack: 1.0 }, targets: "enemy", description: "Точный выпад." },
  wsk_rapier_parry:   { id: "wsk_rapier_parry",   name: "Парирование",            kind: "buff",    element: "physical", manaCost: 8,  cooldown: 3, targets: "self", description: "+40% уклонения на 2 хода.", effects: [{ id: "haste", duration: 2, potency: 40 }] },
  wsk_rapier_riposte_chain:{ id: "wsk_rapier_riposte_chain", name: "Цепь контратак", kind: "attack", element: "physical", manaCost: 14, cooldown: 4, baseDamage: 30, scaling: { attack: 1.3 }, targets: "enemy", description: "Серия контратак." },
  wsk_rapier_thousand_cuts:{ id: "wsk_rapier_thousand_cuts", name: "Тысяча порезов", kind: "attack", element: "physical", manaCost: 24, cooldown: 6, baseDamage: 50, scaling: { attack: 1.6 }, targets: "enemy", description: "10 быстрых уколов." },
  wsk_rapier_crescent:{ id: "wsk_rapier_crescent", name: "Лунный полумесяц",      kind: "attack",  element: "physical", manaCost: 35, cooldown: 8, baseDamage: 80, scaling: { attack: 2.4 }, targets: "enemy", description: "Идеальный удар, гарантированный крит." },

  // ============ POLEARM ============
  wsk_polearm_swing:  { id: "wsk_polearm_swing",  name: "Размах",                 kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 18, scaling: { attack: 1.15 }, targets: "enemy", description: "Размашистый удар алебардой." },
  wsk_polearm_sweep:  { id: "wsk_polearm_sweep",  name: "Размах кругом",          kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 28, scaling: { attack: 1.25 }, aoe: true, targets: "all_enemies", description: "Удар по всем врагам." },
  wsk_polearm_hook:   { id: "wsk_polearm_hook",   name: "Крюк",                   kind: "attack",  element: "physical", manaCost: 12, cooldown: 3, baseDamage: 24, scaling: { attack: 1.2 }, targets: "enemy", description: "Цепляет врага.", effects: [{ id: "root", duration: 2, potency: 0 }] },
  wsk_polearm_warden: { id: "wsk_polearm_warden", name: "Страж",                  kind: "buff",    element: "physical", manaCost: 18, cooldown: 6, targets: "self", description: "+30% защиты, +20% контратаки.", effects: [{ id: "fortify", duration: 4, potency: 30 }] },
  wsk_polearm_storm:  { id: "wsk_polearm_storm",  name: "Буря клинков",           kind: "attack",  element: "physical", manaCost: 32, cooldown: 8, baseDamage: 70, scaling: { attack: 2.0 }, aoe: true, targets: "all_enemies", description: "Ураган ударов по всем." },

  // ============ KATANA ============
  wsk_katana_slash:   { id: "wsk_katana_slash",   name: "Срез",                   kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 16, scaling: { attack: 1.1 }, targets: "enemy", description: "Чистый срез." },
  wsk_katana_iaido:   { id: "wsk_katana_iaido",   name: "Иайдо",                  kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 50, scaling: { attack: 2.0 }, targets: "enemy", description: "Молниеносная атака с гарантированной критикой." },
  wsk_katana_crescent:{ id: "wsk_katana_crescent", name: "Полумесяц",             kind: "attack",  element: "physical", manaCost: 18, cooldown: 5, baseDamage: 35, scaling: { attack: 1.4 }, aoe: true, targets: "all_enemies", description: "Дуговой удар по всем." },
  wsk_katana_thousand_blossoms:{ id: "wsk_katana_thousand_blossoms", name: "Тысяча лепестков", kind: "attack", element: "physical", manaCost: 28, cooldown: 6, baseDamage: 60, scaling: { attack: 1.8 }, targets: "enemy", description: "Серия из 7 точных срезов." },
  wsk_katana_void_cut:{ id: "wsk_katana_void_cut", name: "Срез пустоты",          kind: "attack",  element: "void", manaCost: 40, cooldown: 10, baseDamage: 110, scaling: { attack: 2.8 }, targets: "enemy", description: "Удар, разрезающий саму ткань реальности." },

  // ============ FIST ============
  wsk_fist_jab:       { id: "wsk_fist_jab",       name: "Джеб",                   kind: "attack",  element: "physical", manaCost: 0,  cooldown: 0, baseDamage: 8, scaling: { attack: 0.8 }, targets: "enemy", description: "Быстрый удар кулаком." },
  wsk_fist_combo:     { id: "wsk_fist_combo",     name: "Комбо",                  kind: "attack",  element: "physical", manaCost: 8,  cooldown: 2, baseDamage: 16, scaling: { attack: 0.9 }, targets: "enemy", description: "Серия из 3 ударов." },
  wsk_fist_uppercut:  { id: "wsk_fist_uppercut",  name: "Апперкот",               kind: "attack",  element: "physical", manaCost: 14, cooldown: 4, baseDamage: 30, scaling: { attack: 1.5 }, targets: "enemy", description: "Удар снизу.", effects: [{ id: "stun", duration: 1, potency: 0 }] },
  wsk_fist_seven_stars:{ id: "wsk_fist_seven_stars", name: "Семь звёзд",          kind: "attack",  element: "physical", manaCost: 24, cooldown: 6, baseDamage: 50, scaling: { attack: 1.6 }, targets: "enemy", description: "7 точных ударов в уязвимые точки." },
  wsk_fist_dragon_fist:{ id: "wsk_fist_dragon_fist", name: "Кулак Дракона",       kind: "attack",  element: "fire", manaCost: 38, cooldown: 9, baseDamage: 95, scaling: { attack: 2.6 }, targets: "enemy", description: "Финальный удар, призывающий силу дракона.", effects: [{ id: "burn", duration: 3, potency: 12 }] },

  // ============ ORB ============
  wsk_orb_pulse:      { id: "wsk_orb_pulse",      name: "Пульс",                  kind: "spell",   element: "frost", manaCost: 4,  cooldown: 0, baseDamage: 12, scaling: { spellPower: 1.0 }, targets: "enemy", description: "Магическая волна сферы." },
  wsk_orb_frost_shard:{ id: "wsk_orb_frost_shard", name: "Осколок льда",          kind: "spell",   element: "frost", manaCost: 12, cooldown: 3, baseDamage: 30, scaling: { spellPower: 1.3 }, targets: "enemy", description: "Замораживает врага.", effects: [{ id: "chill", duration: 3, potency: 20 }] },
  wsk_orb_barrier:    { id: "wsk_orb_barrier",    name: "Барьер",                 kind: "buff",    element: "frost", manaCost: 16, cooldown: 5, targets: "self", description: "Магический щит, поглощающий урон.", effects: [{ id: "shield", duration: 4, potency: 80 }] },
  wsk_orb_nova:       { id: "wsk_orb_nova",       name: "Морозная нова",          kind: "spell",   element: "frost", manaCost: 22, cooldown: 5, baseDamage: 45, scaling: { spellPower: 1.5 }, aoe: true, targets: "all_enemies", description: "Взрыв холода вокруг.", effects: [{ id: "freeze", duration: 2, potency: 0 }] },
  wsk_orb_singularity:{ id: "wsk_orb_singularity", name: "Сингулярность",         kind: "spell",   element: "void", manaCost: 40, cooldown: 10, baseDamage: 110, scaling: { spellPower: 2.7 }, aoe: true, targets: "all_enemies", description: "Создаёт точку коллапса, втягивающую всё." },

  // ============ RUNE BLADE ============
  wsk_rb_strike:      { id: "wsk_rb_strike",      name: "Рунический удар",        kind: "attack",  element: "shock", manaCost: 0,  cooldown: 0, baseDamage: 18, scaling: { attack: 1.0, spellPower: 0.4 }, targets: "enemy", description: "Меч пульсирует энергией." },
  wsk_rb_rune_charge: { id: "wsk_rb_rune_charge", name: "Заряд руны",             kind: "buff",    element: "shock", manaCost: 12, cooldown: 4, targets: "self", description: "+30% урона руны на 4 хода.", effects: [{ id: "fortify", duration: 4, potency: 30 }] },
  wsk_rb_arc_slash:   { id: "wsk_rb_arc_slash",   name: "Дуговой срез",           kind: "attack",  element: "shock", manaCost: 16, cooldown: 4, baseDamage: 36, scaling: { attack: 1.4, spellPower: 0.5 }, aoe: true, targets: "all_enemies", description: "Срез с вспышкой молнии." },
  wsk_rb_runic_blast: { id: "wsk_rb_runic_blast", name: "Рунический взрыв",       kind: "spell",   element: "shock", manaCost: 25, cooldown: 6, baseDamage: 55, scaling: { spellPower: 1.6, attack: 0.6 }, targets: "enemy", description: "Высвобождение всех рун." },
  wsk_rb_eternal_edge:{ id: "wsk_rb_eternal_edge", name: "Вечная грань",          kind: "attack",  element: "void", manaCost: 38, cooldown: 9, baseDamage: 100, scaling: { attack: 2.5, spellPower: 1.0 }, targets: "enemy", description: "Удар, прокалывающий душу." },
};

// Side-effect: register into the main ABILITIES registry.
for (const [id, def] of Object.entries(WEAPON_ABILITIES)) {
  ABILITIES[id] = def;
}

export { WEAPON_ABILITIES };
