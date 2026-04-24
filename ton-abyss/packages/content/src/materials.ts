import type { BaseItem } from "@ton-abyss/shared";

// Crafting materials — stackable, level-gated so they map to difficulty tiers.
export const MATERIALS: Record<string, BaseItem> = {
  mat_linen: { id: "mat_linen", name: "Лён", slot: "material", levelReq: 1, stackable: true, maxStack: 999, sellValue: 1 },
  mat_leather: { id: "mat_leather", name: "Кожа", slot: "material", levelReq: 1, stackable: true, maxStack: 999, sellValue: 2 },
  mat_iron: { id: "mat_iron", name: "Железо", slot: "material", levelReq: 1, stackable: true, maxStack: 999, sellValue: 3 },
  mat_steel: { id: "mat_steel", name: "Сталь", slot: "material", levelReq: 10, stackable: true, maxStack: 999, sellValue: 9 },
  mat_mithril: { id: "mat_mithril", name: "Мифрил", slot: "material", levelReq: 25, stackable: true, maxStack: 999, sellValue: 40 },
  mat_adamant: { id: "mat_adamant", name: "Адамант", slot: "material", levelReq: 40, stackable: true, maxStack: 999, sellValue: 160 },
  mat_void_silk: { id: "mat_void_silk", name: "Шёлк Бездны", slot: "material", levelReq: 35, stackable: true, maxStack: 999, sellValue: 220 },
  mat_phoenix_feather: { id: "mat_phoenix_feather", name: "Перо феникса", slot: "material", levelReq: 30, stackable: true, maxStack: 999, sellValue: 140 },
  mat_abyss_shard: { id: "mat_abyss_shard", name: "Осколок Бездны", slot: "material", levelReq: 30, stackable: true, maxStack: 999, sellValue: 600 },
  mat_boss_soul: { id: "mat_boss_soul", name: "Душа босса", slot: "material", levelReq: 20, stackable: true, maxStack: 99, sellValue: 400 },
};
