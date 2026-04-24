import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, RarityId } from "@ton-abyss/shared";
import { confirmDialog } from "../components/ConfirmDialog.js";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { EmptyState } from "../components/EmptyState.js";

const RARITY_RU: Record<RarityId, string> = {
  common: "обычный", uncommon: "необычный", rare: "редкий", epic: "эпический",
  legendary: "легендарный", mythic: "мифический", abyssal: "абиссальный",
};

export function Market() {
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

  const pendingListing = useGame((s) => s.pendingListing);
  const setPendingListing = useGame((s) => s.setPendingListing);

  const [tab, setTab] = useState<"browse" | "mine" | "list" | "history">("browse");
  const [rarityFilter, setRarityFilter] = useState<RarityId | "all">("all");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "recent" | "hot">("recent");
  const [listingItem, setListingItem] = useState<ItemInstance | null>(null);
  const [listingPrice, setListingPrice] = useState<number>(100);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    if (pendingListing?.destination === "market") {
      const found = [...inventory, ...stash].find((i) => i.uid === pendingListing.itemUid);
      if (found) {
        setTab("list");
        setListingItem(found);
        const base = ITEMS[found.baseId];
        if (base) setListingPrice((base.sellValue ?? 100) * 5);
      }
      setPendingListing(null);
    }
  }, [pendingListing, inventory, stash, setPendingListing]);

  const fairPriceFor = (item: ItemInstance): number => {
    const base = ITEMS[item.baseId];
    if (!base) return 0;
    const rarityIdx = ["common","uncommon","rare","epic","legendary","mythic","abyssal"].indexOf(item.rarity);
    return Math.floor((base.sellValue ?? 100) * 4 * (1 + rarityIdx * 0.5));
  };

  const browse = useMemo(() => {
    let arr = market.listings.filter((l) => !l.isMine);
    if (rarityFilter !== "all") arr = arr.filter((l) => l.item.rarity === rarityFilter);
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    else if (sort === "hot") {
      arr = arr
        .map((l) => ({ l, ratio: l.price / Math.max(1, fairPriceFor(l.item)) }))
        .filter((x) => x.ratio < 0.85)
        .sort((a, b) => a.ratio - b.ratio)
        .map((x) => x.l);
    }
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
    <ScreenLayout
      title="Маркет"
      subtitle={`Купля-продажа · комиссия 5%+10%`}
      accent="#f59e0b"
      action={<button className="btn-ghost text-xs px-2 py-1.5" onClick={refresh} aria-label="Обновить">⟳</button>}
    >
      <div className="card-elevated p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-micro">Мои активные лоты</div>
          <div className="text-title text-amber-200">{mine.length} / {market.maxActiveListings}</div>
        </div>
        <div className="text-right">
          <div className="text-micro">Баланс</div>
          <div className="text-title text-amber-300 tabular-nums">{(character?.gold ?? 0).toLocaleString("ru-RU")} g</div>
        </div>
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
              <option value="hot">🔥 Горячие</option>
            </select>
          </div>
          <div className="space-y-1.5">
            {browse.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Пусто. Ждите NPC-предложений.</div>}
            {browse.map((l) => {
              const base = ITEMS[l.item.baseId];
              if (!base) return null;
              const canAfford = (character?.gold ?? 0) >= l.price;
              const fair = fairPriceFor(l.item);
              const ratio = l.price / Math.max(1, fair);
              const hot = ratio < 0.85;
              const overpriced = ratio > 1.3;
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-rarity={l.item.rarity}
                  className="card p-2.5 flex items-center gap-3 rarity-gradient-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm rarity-text truncate flex items-center gap-1">
                      {base.name}
                      {hot && <span className="text-[9px] px-1 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/30">🔥 ГОРЯЧО</span>}
                      {overpriced && <span className="text-[9px] px-1 py-0.5 rounded bg-zinc-500/20 text-zinc-300">дорого</span>}
                    </div>
                    <div className="text-[10px] text-white/55">{RARITY_RU[l.item.rarity]} · ур. {l.item.level} · {l.sellerName}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${canAfford ? "text-amber-300" : "text-red-300/60"}`}>{l.price}g</div>
                    <div className="text-[9px] text-white/40">≈{fair}g</div>
                    <button
                      className="btn-ghost text-[10px] mt-1 px-2"
                      disabled={!canAfford}
                      onClick={async () => {
                        if (l.price > 1000) {
                          const ok = await confirmDialog({
                            title: `Купить ${base.name}?`,
                            message: `Стоимость: ${l.price}g (обычно ~${fair}g).`,
                            confirmText: "Купить",
                            tone: hot ? "default" : "warning",
                          });
                          if (!ok) return;
                        }
                        buy(l.id);
                      }}
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
          {market.history.length === 0 && <EmptyState icon="scroll" title="История пуста" hint="Ваши проданные лоты появятся здесь." />}
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
    </ScreenLayout>
  );
}
