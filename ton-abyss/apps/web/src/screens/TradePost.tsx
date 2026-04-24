import { motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { EmptyState } from "../components/EmptyState.js";

const RARITY_COLORS: Record<string, string> = {
  common: "border-white/15",
  rare: "border-cyan-400/40",
  legendary: "border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.18)]",
};

export function TradePost() {
  const tradePost = useGame((s) => s.tradePost);
  const refresh = useGame((s) => s.tradeRefresh);
  const accept = useGame((s) => s.tradeAccept);
  const inventory = useGame((s) => s.inventory);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ScreenLayout
      title="Торговый пост"
      subtitle="NPC-обмен · 3 предложения · 5 обменов/день"
      accent="#22d3ee"
      action={
        <button className="btn-ghost text-xs px-2 py-1.5" onClick={refresh} aria-label="Обновить">⟳</button>
      }
    >
      <div className="card-elevated p-3 flex items-center gap-2">
        <div className="flex-1">
          <div className="text-micro">Обменов сегодня</div>
          <div className="text-title text-cyan-300">{tradePost.acceptedToday} / 5</div>
        </div>
        <div className="text-caption">Обновление через ~6ч</div>
      </div>

      {tradePost.offers.length === 0 ? (
        <EmptyState
          icon="scroll"
          title="NPC ещё не пришли"
          hint="Обновите или зайдите позже — купцы появляются каждые 6 часов."
        />
      ) : (
        <div className="space-y-3">
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
                className={`card-elevated p-4 space-y-3 border ${RARITY_COLORS[offer.rarity] ?? "border-white/15"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-title text-amber-200 truncate">{offer.npcName}</div>
                    <div className="text-caption italic truncate">{offer.npcFlavor}</div>
                  </div>
                  <div className={`chip ${offer.rarity === "legendary" ? "chip-accent" : offer.rarity === "rare" ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-200" : ""}`}>
                    {offer.rarity === "legendary" ? "Легенд." : offer.rarity === "rare" ? "Редкий" : "Обычный"}
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="card-flat p-2 text-center">
                    <div className="text-micro mb-1">Хочет</div>
                    <div className="text-body text-rose-200 font-bold truncate">{wantBase?.name ?? "—"}</div>
                    <div className="text-caption">{offer.wantsRarity}</div>
                  </div>
                  <div className="text-2xl text-white/35">⇄</div>
                  <div className="card-flat p-2 text-center">
                    <div className="text-micro mb-1">Даёт</div>
                    <div className="text-body text-emerald-200 font-bold truncate">{giveBase?.name ?? "—"}</div>
                    <div className="text-caption">случ. редкость</div>
                  </div>
                </div>

                <button
                  className={`w-full py-2 rounded-lg text-body font-bold ${haveIt ? "bg-emerald-500/30 text-emerald-100 border border-emerald-400/40" : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"}`}
                  disabled={!haveIt}
                  onClick={() => accept(offer.id)}
                >
                  {haveIt ? "✓ Согласиться" : "Нет нужного предмета"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </ScreenLayout>
  );
}
