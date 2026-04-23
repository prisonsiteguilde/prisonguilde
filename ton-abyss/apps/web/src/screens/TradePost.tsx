import { motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";

const RARITY_COLORS: Record<string, string> = {
  common: "border-white/15",
  rare: "border-cyan-400/40",
  legendary: "border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.18)]",
};

export function TradePost() {
  const setScreen = useGame((s) => s.setScreen);
  const tradePost = useGame((s) => s.tradePost);
  const refresh = useGame((s) => s.tradeRefresh);
  const accept = useGame((s) => s.tradeAccept);
  const inventory = useGame((s) => s.inventory);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="px-3 py-3 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Торговый пост</h2>
        <button className="btn-ghost text-xs" onClick={refresh}>⟳</button>
      </div>

      <div className="card p-2 text-xs flex items-center gap-2">
        <div className="flex-1 text-white/60">Обменов сегодня: <span className="text-emerald-300 font-bold">{tradePost.acceptedToday}/5</span></div>
        <div className="text-[10px] text-white/45">Обновление через ~6ч</div>
      </div>

      <div className="space-y-2">
        {tradePost.offers.length === 0 && <div className="text-white/45 text-center py-8 text-sm">NPC ещё не пришли. Обновите.</div>}
        {tradePost.offers.map((offer) => {
          const wantBase = offer.wantsItemBaseId ? ITEMS[offer.wantsItemBaseId] : null;
          const giveBase = offer.givesItemBaseId ? ITEMS[offer.givesItemBaseId] : null;
          const haveIt = wantBase && offer.wantsRarity
            ? inventory.some((it) => it.baseId === wantBase.id && it.rarity === offer.wantsRarity)
            : false;
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-3 space-y-2 border ${RARITY_COLORS[offer.rarity] ?? "border-white/15"}`}
            >
              <div>
                <div className="font-display text-sm text-amber-200">{offer.npcName}</div>
                <div className="text-[10px] italic text-white/55">{offer.npcFlavor}</div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
                <div className="text-center">
                  <div className="text-[9px] text-white/45 uppercase">Хочет</div>
                  <div className="text-rose-200 font-bold truncate">{wantBase?.name ?? "—"}</div>
                  <div className="text-[10px] text-white/55">{offer.wantsRarity}</div>
                </div>
                <div className="text-2xl text-white/40">⇄</div>
                <div className="text-center">
                  <div className="text-[9px] text-white/45 uppercase">Даёт</div>
                  <div className="text-emerald-200 font-bold truncate">{giveBase?.name ?? "—"}</div>
                  <div className="text-[10px] text-white/55">случ. редкость</div>
                </div>
              </div>

              <button
                className={`w-full py-2 rounded-lg text-xs font-bold ${haveIt ? "bg-emerald-500/30 text-emerald-100 border border-emerald-400/40" : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"}`}
                disabled={!haveIt}
                onClick={() => accept(offer.id)}
              >
                {haveIt ? "Согласиться" : "Нет нужного предмета"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
