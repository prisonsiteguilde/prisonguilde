import { useGame } from "../store.js";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function WorldBoss() {
  const wb = useGame((s) => s.worldBoss);
  const char = useGame((s) => s.character);
  const spawnWorldBoss = useGame((s) => s.spawnWorldBoss);
  const attackWorldBoss = useGame((s) => s.attackWorldBoss);
  const claimWorldBossReward = useGame((s) => s.claimWorldBossReward);
  const pushToast = useGame((s) => s.pushToast);
  const [, tick] = useState(0);
  useEffect(() => { const id = setInterval(() => tick((t) => t + 1), 1000); return () => clearInterval(id); }, []);

  const hpPct = wb ? Math.max(0, (wb.hpCurrent / wb.hpMax) * 100) : 0;
  const timeLeft = wb ? Math.max(0, wb.endsAt - Date.now()) : 0;
  const hrs = Math.floor(timeLeft / 3600_000);
  const mins = Math.floor((timeLeft % 3600_000) / 60_000);
  const myContrib = wb && char ? wb.contributors[char.id] ?? 0 : 0;
  const myReward = wb && char ? wb.rewards[char.id] : undefined;
  const totalDmg = wb ? Object.values(wb.contributors).reduce((a, b) => a + b, 0) : 0;
  const myShare = totalDmg > 0 ? (myContrib / totalDmg) * 100 : 0;
  const defeated = wb && wb.hpCurrent <= 0;

  return (
    <ScreenLayout title="Мировой Босс" subtitle="Групповой рейд, 24ч" back="home" accent="#ef4444">
      {!wb ? (
        <div className="card-elevated p-6 text-center">
          <div className="text-[64px] mb-2">🐉</div>
          <div className="text-title mb-1">Босса нет</div>
          <div className="text-caption text-white/60 mb-4">Призвать для всех. Разделит золото/шарды по урону.</div>
          <button onClick={spawnWorldBoss} className="btn-primary px-5 py-2.5 rounded-xl">Призвать босса</button>
        </div>
      ) : (
        <>
          <div className="card-elevated p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-black/20 to-transparent" />
            <div className="relative">
              <div className="text-[72px] text-center mb-1">{defeated ? "💀" : "🐉"}</div>
              <div className="text-title text-center" style={{ color: defeated ? "#94a3b8" : "#ef4444" }}>{wb.name}</div>
              <div className="text-caption text-center text-white/60 mb-3">
                {defeated ? "Повержен!" : `${hrs}ч ${mins}мин до ухода`}
              </div>
              <div className="relative h-4 rounded-full bg-white/5 overflow-hidden border border-rose-500/30 mb-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300"
                  animate={{ width: `${hpPct}%` }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 grid place-items-center text-[11px] font-bold">
                  {wb.hpCurrent.toLocaleString("ru-RU")} / {wb.hpMax.toLocaleString("ru-RU")}
                </div>
              </div>
              {!defeated && (
                <button
                  onClick={() => {
                    const r = attackWorldBoss();
                    if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
                  }}
                  className="btn-primary w-full mt-3 py-3 rounded-xl font-bold"
                >
                  ⚔ Атаковать (−5 энергии)
                </button>
              )}
            </div>
          </div>

          <div className="card-flat p-3">
            <div className="text-micro text-white/60 mb-2">Ваш вклад</div>
            <div className="flex items-baseline justify-between">
              <span className="text-title">{myContrib.toLocaleString("ru-RU")} урона</span>
              <span className="text-caption text-amber-300">{myShare.toFixed(1)}%</span>
            </div>
          </div>

          {defeated && myReward && !myReward.claimed && (
            <button
              onClick={() => {
                const r = claimWorldBossReward();
                if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
              }}
              className="w-full card-elevated p-4 bg-gradient-to-r from-amber-900/40 to-yellow-900/40 border-amber-500/40"
            >
              <div className="text-title text-amber-200">🏆 Забрать награду</div>
              <div className="text-caption text-white/70">+{myReward.gold}g, +{myReward.shards}🔹</div>
            </button>
          )}

          {defeated && myReward?.claimed && (
            <div className="card-ghost p-3 text-caption text-emerald-300 text-center">Награда получена.</div>
          )}
        </>
      )}
    </ScreenLayout>
  );
}
