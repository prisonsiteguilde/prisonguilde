import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, RarityId } from "@ton-abyss/shared";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ItemTile } from "../components/ItemTile.js";
import { confirmDialog } from "../components/ConfirmDialog.js";

const SLOT_LABEL: Record<string, string> = {
  weapon: "Оружие",
  offhand: "Вторая рука",
  head: "Голова",
  chest: "Броня",
  legs: "Ноги",
  hands: "Руки",
  feet: "Сапоги",
  ring: "Кольцо",
  amulet: "Амулет",
  relic: "Реликвия",
};

const SLOT_ORDER = ["weapon", "offhand", "head", "chest", "legs", "hands", "feet", "ring", "amulet", "relic"];

export function Inventory() {
  const inv = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const equipItem = useGame((s) => s.equipItem);
  const unequip = useGame((s) => s.unequip);
  const setScreen = useGame((s) => s.setScreen);
  const [filter, setFilter] = useState<"all" | "gear" | "consumables" | "materials">("all");
  const [rarityFilter, setRarityFilter] = useState<RarityId | "all">("all");
  const [sortBy, setSortBy] = useState<"rarity" | "level" | "name">("rarity");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ItemInstance | null>(null);

  const equippedSet = useMemo(
    () => new Set(Object.values(equipped).filter((v): v is string => !!v)),
    [equipped],
  );

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inv
      .filter((i) => !equippedSet.has(i.uid))
      .filter((i) => {
        const b = ITEMS[i.baseId];
        if (!b) return false;
        if (filter === "consumables" && b.slot !== "consumable") return false;
        if (filter === "materials" && b.slot !== "material" && b.slot !== "rune") return false;
        if (filter === "gear" && !["weapon", "offhand", "head", "chest", "legs", "hands", "feet", "ring", "amulet", "relic"].includes(b.slot)) return false;
        if (rarityFilter !== "all" && i.rarity !== rarityFilter) return false;
        if (q && !b.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return (ITEMS[a.baseId]?.name ?? "").localeCompare(ITEMS[b.baseId]?.name ?? "");
        if (sortBy === "level") return (b.level - a.level) || rarityOrder(b.rarity) - rarityOrder(a.rarity);
        return rarityOrder(b.rarity) - rarityOrder(a.rarity) || (b.level - a.level);
      });
  }, [inv, equippedSet, filter, rarityFilter, sortBy, search]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Инвентарь</h2>
        <span className="w-16" />
      </div>

      {/* Paper doll */}
      <div className="card p-4">
        <div className="font-display tracking-wider mb-3 text-white/80">Экипировка</div>
        <div className="grid grid-cols-5 gap-2">
          {SLOT_ORDER.map((slot) => {
            const uid = equipped[slot];
            const it = uid ? inv.find((i) => i.uid === uid) : undefined;
            return (
              <button
                key={slot}
                className="aspect-square rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center p-1 relative"
                onClick={() => {
                  if (it) unequip(slot);
                }}
              >
                {it ? (
                  <div data-rarity={it.rarity} className="rarity-glow w-full h-full rounded-md flex flex-col items-center justify-center">
                    <span className="text-lg">{slotIcon(slot)}</span>
                    <span className="text-[9px] mt-0.5 truncate w-full" style={{ color: RARITY_COLOR[it.rarity] }}>
                      {ITEMS[it.baseId]?.name}
                    </span>
                    {it.upgradeLevel > 0 && (
                      <span className="absolute top-0.5 right-0.5 text-[9px] font-mono text-amber-300">+{it.upgradeLevel}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="text-2xl opacity-20">{slotIcon(slot)}</span>
                    <span className="text-[9px] text-white/30 mt-1">{SLOT_LABEL[slot]}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 text-sm flex-wrap">
          {(["all", "gear", "consumables", "materials"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg border ${filter === f ? "border-abyss-500 bg-abyss-500/20 text-white" : "border-white/10 bg-white/5 text-white/60"}`}
            >
              {f === "all" ? "Всё" : f === "gear" ? "Снаряж." : f === "consumables" ? "Расх." : "Ресурсы"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center flex-wrap text-[11px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск…"
            className="flex-1 min-w-[120px] bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-abyss-500"
          />
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as RarityId | "all")}
            className="bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs text-white"
          >
            <option value="all">Любая редкость</option>
            <option value="common">Обычное</option>
            <option value="uncommon">Необычное</option>
            <option value="rare">Редкое</option>
            <option value="epic">Эпическое</option>
            <option value="legendary">Легендарное</option>
            <option value="mythic">Мифическое</option>
            <option value="abyssal">Абиссальное</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rarity" | "level" | "name")}
            className="bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs text-white"
          >
            <option value="rarity">По редкости</option>
            <option value="level">По уровню</option>
            <option value="name">По имени</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <ItemTile key={it.uid} item={it} onClick={() => setSelected(it)} />
        ))}
        {items.length === 0 && (
          <div className="col-span-4 text-center text-white/40 py-10">Ничего нет. Войдите в данж!</div>
        )}
      </div>

      {/* Item detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="card p-5 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              data-rarity={selected.rarity}
            >
              <ItemDetails item={selected} onEquip={() => { equipItem(selected.uid); setSelected(null); }} onClose={() => setSelected(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function slotIcon(slot: string): string {
  const map: Record<string, string> = {
    weapon: "🗡️", offhand: "🛡️", head: "👑", chest: "🥼", legs: "👖",
    hands: "🧤", feet: "🥾", ring: "💍", amulet: "📿", relic: "🔮",
  };
  return map[slot] ?? "❔";
}

function rarityOrder(r: RarityId): number {
  return ["common", "uncommon", "rare", "epic", "legendary", "mythic", "abyssal"].indexOf(r);
}

const STAT_RU: Record<string, string> = {
  attack: "Атака", spellPower: "Сила закл.", defense: "Защита", maxHp: "HP", maxMana: "Мана",
  critChance: "Крит. шанс", critMultiplier: "Крит. урон", dodge: "Уклонение", accuracy: "Точность",
  blockChance: "Блок-шанс", blockAmount: "Блок-сила", lifesteal: "Вампиризм", speed: "Скорость",
  luck: "Удача", strength: "Сила", agility: "Ловкость", intellect: "Интеллект",
  vitality: "Выносливость", spirit: "Дух", gold_find: "Золото %", xp_gain: "Опыт %",
  elemental_damage: "Стихия+",
};

const RARITY_RU: Record<string, string> = {
  common: "обычный", uncommon: "необычный", rare: "редкий", epic: "эпический",
  legendary: "легендарный", mythic: "мифический", abyssal: "абиссальный",
};

function ItemDetails({ item, onEquip, onClose }: { item: ItemInstance; onEquip: () => void; onClose: () => void }) {
  const base = ITEMS[item.baseId];
  const setScreen = useGame((s) => s.setScreen);
  const lockItem = useGame((s) => s.lockItem);
  const unlockItem = useGame((s) => s.unlockItem);
  const lockedItems = useGame((s) => s.lockedItems);
  const moveToStash = useGame((s) => s.moveToStash);
  const salvage = useGame((s) => s.salvage);
  if (!base) return null;
  const locked = lockedItems.includes(item.uid);
  const isGear = ["weapon", "offhand", "head", "chest", "legs", "hands", "feet", "ring", "amulet", "neck", "waist", "back", "trinket", "relic"].includes(base.slot);
  return (
    <div className="rarity-border">
      <div className="flex items-center gap-3">
        <div data-rarity={item.rarity} className="w-12 h-12 grid place-items-center rounded-lg bg-white/5 rarity-glow">
          <span className="text-2xl">{slotIcon(base.slot)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl tracking-wider truncate" style={{ color: RARITY_COLOR[item.rarity] }}>
            {base.name} {item.upgradeLevel > 0 && <span className="text-amber-300 font-mono">+{item.upgradeLevel}</span>}
          </div>
          <div className="text-xs text-white/60 tracking-widest">{RARITY_RU[item.rarity] ?? item.rarity} · ур. {item.level}{locked ? " · 🔒" : ""}</div>
        </div>
      </div>
      {base.baseStats && Object.keys(base.baseStats).length > 0 && (
        <div className="mt-3 text-xs text-white/85 space-y-1">
          {Object.entries(base.baseStats).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-white/70">{STAT_RU[k] ?? k}</span>
              <span className="font-mono text-white">{formatStat(k, v)}</span>
            </div>
          ))}
        </div>
      )}
      {item.affixes.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] uppercase text-white/55 mb-1">Аффиксы</div>
          <div className="space-y-1 text-xs">
            {item.affixes.map((a, i) => (
              <div key={i} className="flex justify-between rounded bg-white/5 px-2 py-1">
                <span className="text-emerald-300/80">{STAT_RU[a.stat] ?? a.stat} (T{a.tier}){a.element ? ` [${a.element}]` : ""}</span>
                <span className="font-mono text-emerald-200">{formatStat(a.stat, a.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {base.flavor && <div className="mt-3 text-[11px] italic text-white/55">„{base.flavor}"</div>}

      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          {isGear && (
            <button className="btn-primary flex-1" onClick={onEquip}>Экипировать</button>
          )}
          <button className="btn-ghost" onClick={onClose}>Закрыть</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost text-xs" onClick={() => { locked ? unlockItem(item.uid) : lockItem(item.uid); }}>
            {locked ? "🔓 Разблок." : "🔒 Заблок."}
          </button>
          <button className="btn-ghost text-xs" onClick={() => { moveToStash(item.uid); onClose(); }}>В стэш</button>
          <button className="btn-ghost text-xs" onClick={() => { useGame.getState().setPendingListing({ itemUid: item.uid, destination: "market" }); setScreen("market"); onClose(); }}>Маркет →</button>
          <button className="btn-ghost text-xs" onClick={() => { useGame.getState().setPendingListing({ itemUid: item.uid, destination: "auction" }); setScreen("auction"); onClose(); }}>Аукцион →</button>
        </div>
        {!locked && (
          <button
            className="w-full py-2 text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            onClick={async () => {
              const ok = await confirmDialog({
                title: `Распылить ${base.name}?`,
                message: `Получите материалы, пыль и эссенцию качества.${item.rarity === "mythic" || item.rarity === "abyssal" ? " ⚠ Это ценный предмет!" : ""}`,
                confirmText: "♻ Распылить",
                tone: item.rarity === "mythic" || item.rarity === "abyssal" ? "danger" : "warning",
              });
              if (ok) {
                salvage([item.uid]);
                onClose();
              }
            }}
          >
            ♻ Распылить
          </button>
        )}
      </div>
    </div>
  );
}

function formatStat(key: string, v: unknown): string {
  if (typeof v === "number") {
    if (["critChance", "dodge", "accuracy", "blockChance", "lifesteal", "gold_find", "xp_gain"].includes(key)) return (v * 100).toFixed(1) + "%";
    if (key === "critMultiplier") return `+${(v * 100).toFixed(0)}%`;
    return `+${v}`;
  }
  return JSON.stringify(v);
}
