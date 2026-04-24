import type { BaseItem } from "@ton-abyss/shared";
import { ITEMS } from "./items.js";

// Lootbox items as inventory entries (consumables).
const LOOTBOX_ITEMS: BaseItem[] = [
  { id: "lb_bronze", name: "Бронзовый сундук",  slot: "consumable", levelReq: 1,  sellValue: 80,  stackable: true, maxStack: 99, flavor: "Базовый сундук с добычей." },
  { id: "lb_silver", name: "Серебряный сундук", slot: "consumable", levelReq: 8,  sellValue: 480, stackable: true, maxStack: 99, flavor: "Стабильный источник редкостей." },
  { id: "lb_gold",   name: "Золотой сундук",    slot: "consumable", levelReq: 20, sellValue: 2400, stackable: true, maxStack: 99, flavor: "Элитный сундук. Гарантированная эпика." },
  { id: "lb_abyss",  name: "Сундук Бездны",     slot: "consumable", levelReq: 35, sellValue: 8500, stackable: true, maxStack: 99, flavor: "Запретный сундук. Только мифики и абиссальные." },
];

for (const b of LOOTBOX_ITEMS) ITEMS[b.id] = b;

export { LOOTBOX_ITEMS };
