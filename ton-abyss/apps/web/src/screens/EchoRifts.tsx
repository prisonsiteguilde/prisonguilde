import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ECHO_RIFT_TIERS, ECHO_RIFT_PITY_INTERVAL } from "@ton-abyss/content";
import { ICONS } from "../components/Icon.js";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function EchoRifts() {
  const echoRifts = useGame((s) => s.echoRifts);
  const character = useGame((s) => s.character);
  const runEchoRift = useGame((s) => s.runEchoRift);
  const pushToast = useGame((s) => s.pushToast);

  if (!character) return null;

  return (
    <ScreenLayout title="Эхо-Рифты" subtitle={`Эндгейм · лучший тир ${echoRifts.highestTier} · pity ${echoRifts.pityCounter}/${ECHO_RIFT_PITY_INTERVAL}`} accent="#e879f9">

      <div className="card p-4 bg-gradient-to-br from-fuchsia-950/40 to-slate-900/40 border-fuchsia-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300">
            <ICONS.gem size={24} />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg tracking-wide">Эндгейм-разломы</div>
            <div className="text-[11px] text-white/60 mt-0.5">
              Высший пройденный: <span className="text-fuchsia-300">Тир {echoRifts.highestTier}</span> · Пробежек: {echoRifts.clears}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5">
              Гарантированный мифический+ через {ECHO_RIFT_PITY_INTERVAL - echoRifts.pityCounter} зачисток (pity).
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {ECHO_RIFT_TIERS.map((t) => {
          const unlocked = character.level >= t.levelMin && (echoRifts.highestTier + 1 >= t.tier);
          const cleared = echoRifts.highestTier >= t.tier;
          return (
            <motion.div
              key={t.tier}
              whileTap={unlocked ? { scale: 0.99 } : undefined}
              className={`card p-3 ${cleared ? "border-fuchsia-500/30" : unlocked ? "border-amber-500/30" : "border-white/10 opacity-60"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base tracking-wider">{t.ru}</span>
                    {cleared && <span className="chip-success text-[9px]">пройден</span>}
                  </div>
                  <div className="text-[10px] text-white/55 mt-0.5">
                    ур. {t.levelMin}+ · {t.affixCount} аффикс{t.affixCount > 1 ? "а" : ""} · ×{t.baseHpMult.toFixed(1)} HP, ×{t.baseDmgMult.toFixed(1)} dmg
                  </div>
                  <div className="text-[10px] text-amber-300/70 mt-0.5">
                    {t.baseGold}g · {t.baseXp} XP · мин. редкость: {t.rarityFloor}
                  </div>
                </div>
                <button
                  disabled={!unlocked}
                  onClick={() => {
                    const r = runEchoRift(t.tier);
                    if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${
                    unlocked ? "bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-200 hover:bg-fuchsia-500/30" : "bg-white/5 border border-white/10 text-white/30"
                  }`}
                >
                  {unlocked ? "Войти" : "Закрыто"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-[10px] text-white/40 text-center pt-2 leading-relaxed">
        Эхо-Рифты — повторяемый эндгейм-контент. Аффиксы рандомизируются при каждой пробежке.
        <br />
        Чем выше тир — тем сложнее враги и щедрее награды.
      </div>
    </ScreenLayout>
  );
}
