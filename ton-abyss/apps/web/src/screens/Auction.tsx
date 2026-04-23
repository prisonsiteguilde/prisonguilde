import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, RarityId } from "@ton-abyss/shared";

const RARITY_RU: Record<RarityId, string> = {
  common: "обычный", uncommon: "необычный", rare: "редкий", epic: "эпический",
  legendary: "легендарный", mythic: "мифический", abyssal: "абиссальный",
};

function fmtRemaining(ms: number): string {
  if (ms <= 0) return "истёк";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  if (h > 0) return `${h}ч ${m}м`;
  if (m >= 5) return `${m}м`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Auction() {
  const setScreen = useGame((s) => s.setScreen);
  const auction = useGame((s) => s.auction);
  const refresh = useGame((s) => s.auctionRefresh);
  const bid = useGame((s) => s.auctionBid);
  const buyout = useGame((s) => s.auctionBuyout);
  const create = useGame((s) => s.auctionCreate);
  const inventory = useGame((s) => s.inventory);
  const stash = useGame((s) => s.stash);
  const character = useGame((s) => s.character);
  const equipped = useGame((s) => s.equipped);
  const lockedItems = useGame((s) => s.lockedItems);

  const pendingListing = useGame((s) => s.pendingListing);
  const setPendingListing = useGame((s) => s.setPendingListing);

  const [tab, setTab] = useState<"browse" | "mine" | "create" | "history">("browse");
  const [createItem, setCreateItem] = useState<ItemInstance | null>(null);
  const [startPrice, setStartPrice] = useState(200);
  const [buyoutPrice, setBuyoutPrice] = useState<number | null>(1500);
  const [duration, setDuration] = useState<1 | 6 | 24>(6);
  const [bidAmount, setBidAmount] = useState<Record<string, number>>({});
  const [_tick, setTick] = useState(0);

  useEffect(() => {
    refresh();
    const t1 = setInterval(() => { refresh(); }, 30_000);
    const t2 = setInterval(() => { setTick((x) => x + 1); }, 1000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [refresh]);

  useEffect(() => {
    if (pendingListing?.destination === "auction") {
      const found = [...inventory, ...stash].find((i) => i.uid === pendingListing.itemUid);
      if (found) {
        setTab("create");
        setCreateItem(found);
        const base = ITEMS[found.baseId];
        if (base) {
          setStartPrice((base.sellValue ?? 100) * 4);
          setBuyoutPrice((base.sellValue ?? 100) * 12);
        }
      }
      setPendingListing(null);
    }
  }, [pendingListing, inventory, stash, setPendingListing]);

  const browse = auction.lots.filter((l) => !l.isMine);
  const mine = auction.lots.filter((l) => l.isMine);

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
        <h2 className="panel-title">Аукцион</h2>
        <button className="btn-ghost text-xs" onClick={refresh}>⟳</button>
      </div>

      <div className="card p-2 flex items-center gap-2 text-xs">
        <div className="flex-1 text-white/60">Активных лотов: <span className="text-fuchsia-300 font-bold">{auction.lots.length}</span></div>
        <div className="text-amber-300 font-bold">{character?.gold ?? 0} g</div>
      </div>

      <div className="flex gap-1 text-xs">
        {(["browse", "mine", "create", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg border ${tab === t ? "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-200" : "bg-white/5 border-white/10 text-white/60"}`}
          >
            {t === "browse" ? "Лоты" : t === "mine" ? "Мои" : t === "create" ? "Выставить" : "История"}
          </button>
        ))}
      </div>

      {tab === "browse" && (
        <div className="space-y-2">
          {browse.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Лотов нет.</div>}
          {browse.map((lot) => {
            const base = ITEMS[lot.item.baseId];
            if (!base) return null;
            const remaining = lot.endsAt - Date.now();
            const myBid = bidAmount[lot.id] ?? lot.currentBid + Math.max(50, Math.floor(lot.currentBid * 0.05));
            return (
              <motion.div
                key={lot.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                data-rarity={lot.item.rarity}
                className="card p-3 rarity-gradient-border space-y-2"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm rarity-text truncate">{base.name}</div>
                    <div className="text-[10px] text-white/55">{RARITY_RU[lot.item.rarity]} · ур. {lot.item.level} · продавец: {lot.sellerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/55">осталось</div>
                    <div className={`text-xs font-bold ${remaining < 5 * 60_000 ? "text-red-300" : "text-white/85"}`}>{fmtRemaining(remaining)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <div className="text-white/55 text-[10px]">Тек. ставка</div>
                    <div className="text-fuchsia-200 font-bold">{lot.currentBid}g</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white/55 text-[10px]">Выкуп</div>
                    <div className="text-amber-300 font-bold">{lot.buyoutPrice ?? "—"}{lot.buyoutPrice ? "g" : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={myBid}
                    min={lot.currentBid + 1}
                    onChange={(e) => setBidAmount({ ...bidAmount, [lot.id]: parseInt(e.target.value || "0", 10) })}
                    className="bg-black/40 border border-white/15 rounded px-2 py-1.5 text-amber-200 text-xs flex-1"
                  />
                  <button
                    className="btn-ghost text-xs px-3"
                    disabled={(character?.gold ?? 0) < myBid || myBid <= lot.currentBid}
                    onClick={() => bid(lot.id, myBid)}
                  >
                    Ставка
                  </button>
                  {lot.buyoutPrice && (
                    <button
                      className="btn-abyssal text-[10px] px-2"
                      disabled={(character?.gold ?? 0) < lot.buyoutPrice}
                      onClick={() => buyout(lot.id)}
                    >
                      Выкуп
                    </button>
                  )}
                </div>
                {lot.bids.length > 0 && (
                  <div className="text-[10px] text-white/50 max-h-12 overflow-y-auto">
                    {lot.bids.slice(0, 3).map((b, bi) => (
                      <div key={bi}>· {b.bidderName}: {b.amount}g</div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-2">
          {mine.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Нет своих лотов.</div>}
          {mine.map((lot) => {
            const base = ITEMS[lot.item.baseId];
            if (!base) return null;
            const remaining = lot.endsAt - Date.now();
            return (
              <div key={lot.id} data-rarity={lot.item.rarity} className="card p-2.5 rarity-gradient-border">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm rarity-text truncate">{base.name}</div>
                    <div className="text-[10px] text-white/55">{RARITY_RU[lot.item.rarity]} · ставок: {lot.bids.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-fuchsia-200 font-bold">{lot.currentBid}g</div>
                    <div className="text-[10px] text-white/55">{fmtRemaining(remaining)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "create" && (
        <div className="space-y-2">
          {!createItem && (
            <>
              <div className="text-[11px] text-white/55">Выберите предмет:</div>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {listable.length === 0 && <div className="text-white/45 text-center py-8 text-sm">Нет предметов.</div>}
                {listable.map((it) => {
                  const base = ITEMS[it.baseId]!;
                  return (
                    <button
                      key={it.uid}
                      data-rarity={it.rarity}
                      onClick={() => { setCreateItem(it); setStartPrice((base.sellValue ?? 100) * 4); setBuyoutPrice((base.sellValue ?? 100) * 12); }}
                      className="card p-2 w-full text-left flex items-center gap-2 rarity-gradient-border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm rarity-text truncate">{base.name}</div>
                        <div className="text-[10px] text-white/50">{RARITY_RU[it.rarity]} · ур. {it.level}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {createItem && (
            <div className="card p-3 space-y-3" data-rarity={createItem.rarity}>
              <div className="font-display rarity-text">{ITEMS[createItem.baseId]?.name}</div>
              <div>
                <label className="text-[11px] text-white/65 mb-1 block">Стартовая ставка (g)</label>
                <input type="number" value={startPrice} min={50} onChange={(e) => setStartPrice(Math.max(50, parseInt(e.target.value || "0", 10)))} className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-amber-200 font-bold" />
              </div>
              <div>
                <label className="text-[11px] text-white/65 mb-1 block">Выкуп (необязательно)</label>
                <input type="number" value={buyoutPrice ?? 0} min={0} onChange={(e) => { const v = parseInt(e.target.value || "0", 10); setBuyoutPrice(v > 0 ? v : null); }} className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-amber-200 font-bold" />
              </div>
              <div>
                <label className="text-[11px] text-white/65 mb-1 block">Длительность</label>
                <div className="flex gap-1">
                  {([1, 6, 24] as const).map((h) => (
                    <button key={h} onClick={() => setDuration(h)} className={`flex-1 py-1.5 rounded border text-xs ${duration === h ? "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-200" : "bg-white/5 border-white/10 text-white/60"}`}>{h}ч</button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-white/50">Комиссия выставления: {Math.max(100, Math.floor(startPrice * 0.05))}g · налог 8% при продаже</div>
              <div className="flex gap-2">
                <button className="btn-ghost flex-1" onClick={() => setCreateItem(null)}>Отмена</button>
                <button className="btn-abyssal flex-1" onClick={() => { const r = create(createItem.uid, startPrice, buyoutPrice, duration); if (r.ok) setCreateItem(null); }}>Выставить</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-1.5">
          {auction.history.length === 0 && <div className="text-white/45 text-center py-8 text-sm">История пуста.</div>}
          {auction.history.map((h) => (
            <div key={h.id} className={`card p-2 flex items-center gap-2 ${h.won ? "border-emerald-400/30" : "border-white/10"}`}>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{h.itemName}</div>
                <div className="text-[10px] text-white/55">{h.won ? "Победа" : "Без ставок"}</div>
              </div>
              <div className="text-amber-300 font-bold">{h.finalPrice}g</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
