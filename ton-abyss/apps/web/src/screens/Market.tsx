import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, RarityId } from "@ton-abyss/shared";

const RARITY_RU: Record<RarityId, string> = {
  common: "обычный", uncommon: "необычный", rare: "редкий", epic: "эпический",
  legendary: "легендарный", mythic: "мифический", abyssal: "абиссальный",
};

export function Market() {
  const setScreen = useGame((s) => s.setScreen);
  const market = useGame((s) => s.market);
  const refresh = useGame((s) => s.marketRefresh);
  const buy = useGame((s) => s.marketBuy);
  const list = useGame((s) => s.marketList);
  const cancel = useGame((s) => s.marketCancel);
  const inventory = useGame((s) => s.inventory);
  const stash = useGame((s) => s.stash);
  const character = useGame((s) => s.character);
  const lockedItems = useGame((s) => s.lockedItems);
  const equipped = useGame((s) => s.equipped);

  const [tab, setTab] = useState<"browse" | "mine" | "list" | "history">("browse");
  const [rarityFilter, setRarityFilter] = useState<RarityId | "all">("all");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "recent">("recent");
  const [listingItem, setListingItem] = useState<ItemInstance | null>(null);
  const [listingPrice, setListingPrice] = useState<number>(100);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [refresh]);

  const browse = useMemo(() => {
    let arr = market.listings.filter((l) => !l.isMine);
    if (rarityFilter !== "all") arr = arr.filter((l) => l.item.rarity === rarityFilter);
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    else arr = [...arr].sort((a, b) => b.listedAt - a.listedAt);
    return arr;
  }, [market.listings, rarityFilter, sort]);

  const mine = useMemo(() => market.listings.filter((l) => l.isMine), [market.listings]);

  const listable = useMemo(() => {
    const equippedUids = new Set(Object.values(equipped));
    return [...inventory, ...stash].filter(
      (i) => !equippedUids.has(i.uid) && !lockedItems.includes(i.uid) && i.baseId in ITEMS &&
      ITEMS[i.baseId]!.slot !== "consumable" && ITEMS[i.baseId]!.slot !== "material" && ITEMS[i.baseId]!.slot !== "rune",
    );
  }, [inventory, stash, equipped, lockedItems]);

  return (
    <div className="px-3 py-3 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Маркет</h2>
        <button className="btn-ghost text-xs" onClick={refresh} title="Обновить">⟳</button>
      </div>

      <div className="card p-2 flex items-center gap-2 text-xs">
        <div className="flex-1 text-white/60">Активных: <span className="text-amber-300 font-bold">{mine.length}/{market.maxActiveListings}</span></div>
        <div className="text-amber-300 font-bold">{character?.gold ?? 0} g</div>
      </div>

      <div className="flex gap-1 text-xs">
        {(["browse", "mine", "list", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg border ${tab === t ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200" : "bg-white/5 border-white/10 text-white/60"}`}
          >
            {t === "browse" ? "Лоты" : t === "mine" ? "Мои" : t === "list" ? "Выставить" : "История"}
          </button>
        ))}
      </div>

      {tab === "browse" && (
        <>
          <div className="flex items-center gap-2 text-[11px]">
            <select className="bg-black/40 border border-white/15 rounded px-2 py-1.5 flex-1" value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value as RarityId | "all")}>
              <option value="all">Все редкости</option>
              {(["common","uncommon","rare","epic","legendary","mythic","abyssal"] as RarityId[]).map((r) => (
                <option key={r} value={r}>{RARITY_RU[r]}</option>
              ))}
            </select>
            <select className="bg-black/40 border border-white/15 rounded px-2 py-1.5" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="recent">Недавние</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
            </select>
          </div>
          <div className="space-y-1.5">
            {browse.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Пусто. Ждите NPC-предложений.</div>}
            {browse.map((l) => {
              const base = ITEMS[l.item.baseId];
              if (!base) return null;
              const canAfford = (character?.gold ?? 0) >= l.price;
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-rarity={l.item.rarity}
                  className="card p-2.5 flex items-center gap-3 rarity-gradient-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm rarity-text truncate">{base.name}</div>
                    <div className="text-[10px] text-white/55">{RARITY_RU[l.item.rarity]} · ур. {l.item.level} · {l.sellerName}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${canAfford ? "text-amber-300" : "text-red-300/60"}`}>{l.price}g</div>
                    <button
                      className="btn-ghost text-[10px] mt-1 px-2"
                      disabled={!canAfford}
                      onClick={() => buy(l.id)}
                    >
                      Купить
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tab === "mine" && (
        <div className="space-y-1.5">
          {mine.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Нет активных лотов.</div>}
          {mine.map((l) => {
            const base = ITEMS[l.item.baseId];
            if (!base) return null;
            const remaining = Math.max(0, l.expiresAt - Date.now());
            const hours = Math.floor(remaining / 3_600_000);
            return (
              <div key={l.id} data-rarity={l.item.rarity} className="card p-2.5 flex items-center gap-3 rarity-gradient-border">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm rarity-text truncate">{base.name}</div>
                  <div className="text-[10px] text-white/55">{RARITY_RU[l.item.rarity]} · {hours}ч до истечения</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-300">{l.price}g</div>
                  <button className="btn-ghost text-[10px] mt-1 px-2 text-red-300" onClick={() => cancel(l.id)}>Снять</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "list" && (
        <div className="space-y-2">
          {!listingItem && (
            <>
              <div className="text-[11px] text-white/55">Выберите предмет для выставления (из инвентаря/стэша):</div>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {listable.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Нет предметов для продажи.</div>}
                {listable.map((it) => {
                  const base = ITEMS[it.baseId]!;
                  return (
                    <button
                      key={it.uid}
                      data-rarity={it.rarity}
                      onClick={() => { setListingItem(it); setListingPrice((base.sellValue ?? 100) * 5); }}
                      className="card p-2 w-full text-left flex items-center gap-2 rarity-gradient-border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm rarity-text truncate">{base.name}</div>
                        <div className="text-[10px] text-white/50">{RARITY_RU[it.rarity]} · ур. {it.level}</div>
                      </div>
                      <div className="text-[10px] text-amber-300/60">~{(base.sellValue ?? 100) * 5}g</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {listingItem && (
            <div className="card p-3 space-y-3" data-rarity={listingItem.rarity}>
              <div>
                <div className="font-display text-base rarity-text">{ITEMS[listingItem.baseId]?.name}</div>
                <div className="text-[10px] text-white/55">{RARITY_RU[listingItem.rarity]} · ур. {listingItem.level}</div>
              </div>
              <div>
                <label className="text-[11px] text-white/65 mb-1 block">Цена (g)</label>
                <input
                  type="number"
                  min={10}
                  value={listingPrice}
                  onChange={(e) => setListingPrice(Math.max(10, parseInt(e.target.value || "0", 10)))}
                  className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-amber-200 font-bold"
                />
                <div className="text-[10px] text-white/50 mt-1">Комиссия за выставление: {Math.max(50, Math.floor(listingPrice * 0.05))}g · налог продажи: 10%</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost flex-1" onClick={() => setListingItem(null)}>Отмена</button>
                <button
                  className="btn-abyssal flex-1"
                  onClick={() => {
                    const r = list(listingItem.uid, listingPrice);
                    if (r.ok) setListingItem(null);
                  }}
                >
                  Выставить
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-1.5">
          {market.history.length === 0 && <div className="text-white/45 text-center py-8 text-sm">История продаж пуста.</div>}
          {market.history.map((h) => (
            <div key={h.id} data-rarity={h.rarity as RarityId} className="card p-2 flex items-center gap-2 rarity-gradient-border">
              <div className="flex-1 min-w-0">
                <div className="text-sm rarity-text truncate">{h.itemName}</div>
                <div className="text-[10px] text-white/55">→ {h.buyerName}</div>
              </div>
              <div className="text-amber-300 font-bold">{h.price}g</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
