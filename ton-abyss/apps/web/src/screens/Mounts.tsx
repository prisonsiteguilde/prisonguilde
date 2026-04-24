import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { MOUNTS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Mounts() {
  const char = useGame((s) => s.character)!;
  const mountsOwned = useGame((s) => s.mountsOwned);
  const activeMount = useGame((s) => s.activeMount);
  const buyMount = useGame((s) => s.buyMount);
  const setActiveMount = useGame((s) => s.setActiveMount);
  const bossesKilled = useGame((s) => s.bossesKilled);
  const achievements = useGame((s) => s.achievements);

  return (
    <ScreenLayout title="Скакуны" subtitle={`${mountsOwned.length} в загоне`} back="home" accent="#fde047">

      {activeMount && (
        <div className="card p-3 border-amber-400/40">
          <div className="text-xs text-white/60">Активен</div>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{MOUNTS[activeMount]?.icon}</div>
            <div>
              <div className="font-display text-xl">{MOUNTS[activeMount]?.name}</div>
              <div className="text-xs text-white/50">{MOUNTS[activeMount]?.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Object.values(MOUNTS).map((m) => {
          const owned = mountsOwned.includes(m.id);
          const active = activeMount === m.id;
          let canBuy = true;
          let lockReason = "";
          if (!owned) {
            if (m.unlockCondition === "boss_kill" && m.unlockRef && !(bossesKilled[m.unlockRef] ?? 0)) {
              canBuy = false; lockReason = `Убейте босса ${m.unlockRef}`;
            }
            if (m.unlockCondition === "achievement" && m.unlockRef && !achievements[m.unlockRef]?.unlocked) {
              canBuy = false; lockReason = `Ачивка ${m.unlockRef}`;
            }
          }
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-3 ${owned ? "border-amber-400/40" : "opacity-80"}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-5xl">{m.icon}</div>
                <div className="flex-1">
                  <div className={`font-display text-lg rarity-${m.rarity}`}>{m.name}</div>
                  <div className="text-xs text-white/60">{m.description}</div>
                  <div className="text-[11px] text-white/50 mt-1">
                    Скорость +{Math.floor(m.travelSpeedBonus * 100)}% ·{" "}
                    {m.statBonus?.speed && `speed +${m.statBonus.speed}`}
                    {m.statBonus?.attack && ` · atk +${m.statBonus.attack}`}
                    {m.statBonus?.spellPower && ` · sp +${m.statBonus.spellPower}`}
                    {m.statBonus?.critChance && ` · crit +${Math.floor(m.statBonus.critChance * 100)}%`}
                  </div>
                </div>
                <div>
                  {owned ? (
                    active
                      ? <button className="btn-ghost text-xs" onClick={() => setActiveMount(null)}>Спешиться</button>
                      : <button className="btn-primary text-xs" onClick={() => setActiveMount(m.id)}>Сесть</button>
                  ) : canBuy ? (
                    <button className="btn-primary text-xs" onClick={() => buyMount(m.id)}>
                      {m.costGold ? `${m.costGold}g` : `${m.costShards} 💎`}
                    </button>
                  ) : (
                    <span className="text-xs text-red-300 text-right">{lockReason}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
