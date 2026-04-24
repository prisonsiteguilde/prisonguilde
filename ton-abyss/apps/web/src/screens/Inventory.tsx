import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, RarityId } from "@ton-abyss/shared";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ItemTile } from "../components/ItemTile.js";
import { confirmDialog } from "../components/ConfirmDialog.js";
import { EmptyState } from "../components/EmptyState.js";
import { ScreenLayout } from "../components/ScreenLayout.js";

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
  const [filter, setFilter] = useState<"all" | "gear" | "consumables" | "materials">("all");
  const [rarityFilter, setRarityFilter] = useState<RarityId | "all">("all");
  const [sortBy, setSortBy] = useState<"rarity" | "level" | "name">("rarity");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ItemInstance | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const salvage = useGame((s) => s.salvage);
  const lockedItems = useGame((s) => s.lockedItems);

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
    <ScreenLayout title="Инвентарь" subtitle={`${inv.length} предм. · ${Object.values(equipped).filter(Boolean).length} экипировано`} accent="#10b981">

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

      {/* Bulk-mode toolbar */}
      <div className="flex items-center gap-2">
        <button
          className={`seg-item px-3 ${bulkMode ? "active" : ""}`}
          onClick={() => { setBulkMode((v) => !v); if (bulkMode) setBulkSelected(new Set()); }}
        >
          {bulkMode ? `✓ Выбрано ${bulkSelected.size}` : "Выбрать несколько"}
        </button>
        {bulkMode && bulkSelected.size > 0 && (
          <>
            <button
              className="btn-danger btn-sm"
              onClick={async () => {
                const ok = await confirmDialog({
                  title: `Распылить ${bulkSelected.size} предм.?`,
                  message: "Получите материалы и эссенции качества. Заблокированные будут пропущены.",
                  confirmText: "♻ Распылить всё",
                  tone: "warning",
                });
                if (ok) {
                  const uids = Array.from(bulkSelected).filter((u) => !lockedItems.includes(u));
                  if (uids.length > 0) salvage(uids);
                  setBulkSelected(new Set());
                  setBulkMode(false);
                }
              }}
            >
              ♻ Распылить ({bulkSelected.size})
            </button>
            <button className="btn-ghost btn-sm" onClick={() => setBulkSelected(new Set())}>Сбросить</button>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 stagger-in">
        {items.map((it) => {
          const isSel = bulkSelected.has(it.uid);
          return (
            <div key={it.uid} className="relative tile-lift rounded-lg">
              <ItemTile
                item={it}
                onClick={() => {
                  if (bulkMode) {
                    setBulkSelected((prev) => {
                      const next = new Set(prev);
                      if (next.has(it.uid)) next.delete(it.uid);
                      else next.add(it.uid);
                      return next;
                    });
                  } else {
                    setSelected(it);
                  }
                }}
              />
              {bulkMode && (
                <div
                  className={`absolute top-1 right-1 w-5 h-5 rounded-md border-2 grid place-items-center text-[10px] font-bold pointer-events-none ${isSel ? "bg-emerald-500 border-emerald-300 text-black" : "bg-black/50 border-white/40 text-white/60"}`}
                >
                  {isSel ? "✓" : ""}
                </div>
              )}
              {lockedItems.includes(it.uid) && (
                <div className="absolute top-1 left-1 text-amber-300 text-[10px] pointer-events-none">🔒</div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-4">
            <EmptyState icon="chest" title="Инвентарь пуст" hint="Пройдите данж или откройте сундук." />
          </div>
        )}
      </div>

      {/* Item detail drawer (bottom-sheet on mobile, right-side drawer on wider screens) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute left-0 right-0 bottom-0 card-elevated p-5 w-full max-w-md mx-auto rounded-t-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-rarity={selected.rarity}
            >
              <div className="mx-auto -mt-2 mb-3 h-1 w-10 rounded-full bg-white/20" />
              <ItemDetails item={selected} onEquip={() => { equipItem(selected.uid); setSelected(null); }} onClose={() => setSelected(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenLayout>
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
  const equipped = useGame((s) => s.equipped);
  const inv = useGame((s) => s.inventory);
  if (!base) return null;
  const locked = lockedItems.includes(item.uid);
  const isGear = ["weapon", "offhand", "head", "chest", "legs", "hands", "feet", "ring", "amulet", "neck", "waist", "back", "trinket", "relic"].includes(base.slot);
  // v10: compare vs currently equipped
  const equippedUid = equipped[base.slot];
  const equippedItem = equippedUid ? inv.find((i) => i.uid === equippedUid) : undefined;
  const equippedBase = equippedItem ? ITEMS[equippedItem.baseId] : undefined;
  const comparison: { key: string; delta: number }[] = [];
  if (isGear && equippedItem && equippedBase) {
    const keys = new Set<string>();
    for (const k of Object.keys(base.baseStats ?? {})) keys.add(k);
    for (const k of Object.keys(equippedBase.baseStats ?? {})) keys.add(k);
    for (const a of item.affixes) keys.add(a.stat);
    for (const a of equippedItem.affixes) keys.add(a.stat);
    for (const k of keys) {
      const sumStats = (it: ItemInstance, b: typeof base): number => {
        const bs = (b.baseStats as Record<string, number> | undefined)?.[k] ?? 0;
        const af = it.affixes.filter((a) => a.stat === k).reduce((s, a) => s + a.value, 0);
        return bs + af;
      };
      const d = sumStats(item, base) - sumStats(equippedItem, equippedBase);
      if (Math.abs(d) > 0.0001) comparison.push({ key: k, delta: d });
    }
  }
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
      {comparison.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] uppercase text-white/55 mb-1">Сравнение с экипированным</div>
          <div className="space-y-1 text-xs rounded-lg bg-white/5 p-2 border border-white/10">
            {comparison.map(({ key, delta }) => {
              const pos = delta > 0;
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-white/70">{STAT_RU[key] ?? key}</span>
                  <span className={`font-mono ${pos ? "text-emerald-300" : "text-rose-300"}`}>
                    {pos ? "▲" : "▼"} {formatStat(key, Math.abs(delta))}
                  </span>
                </div>
              );
            })}
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
