import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { FACTIONS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Factions() {
  const factionRep = useGame((s) => s.factionRep);
  const claimed = useGame((s) => s.factionClaimedTiers);
  const claimFactionTier = useGame((s) => s.claimFactionTier);

  return (
    <ScreenLayout title="Фракции" subtitle="Репутация, тиры, награды" back="home" accent="#c084fc">

      <div className="space-y-3">
        {Object.values(FACTIONS).map((f) => {
          const rep = factionRep[f.id] ?? 0;
          const claimedTiers = claimed[f.id] ?? [];
          const currentTier = [...f.tiers].reverse().find((t) => rep >= t.repRequired);
          const nextTier = f.tiers.find((t) => rep < t.repRequired);
          const progress = nextTier ? (rep - (currentTier?.repRequired ?? 0)) / (nextTier.repRequired - (currentTier?.repRequired ?? 0)) : 1;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
              style={{ borderColor: f.color + "55" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl tracking-wider flex items-center gap-2" style={{ color: f.color }}>
                    <span className="text-3xl">{f.icon}</span> {f.name}
                  </div>
                  <div className="text-xs text-white/60 italic">{f.tagline}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">Репутация</div>
                  <div className="text-2xl font-display" style={{ color: f.color }}>{rep}</div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-white/50">{f.sourceLabel}</div>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>{currentTier?.name ?? "—"}</span>
                  {nextTier && <span>→ {nextTier.name} ({nextTier.repRequired})</span>}
                </div>
                <div className="h-2 rounded bg-black/40 overflow-hidden">
                  <div className="h-full" style={{ width: `${progress * 100}%`, background: f.color }} />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {f.tiers.map((t) => {
                  const unlocked = rep >= t.repRequired;
                  const already = claimedTiers.includes(t.tier);
                  return (
                    <div key={t.tier} className={`flex items-center justify-between rounded p-2 text-xs ${unlocked ? "bg-black/30 border border-white/10" : "bg-black/10 opacity-40"}`}>
                      <div>
                        <span className="font-medium" style={{ color: unlocked ? f.color : "#666" }}>T{t.tier} {t.name}</span>
                        <span className="text-white/40 ml-2">({t.repRequired} реп.)</span>
                        <div className="text-[10px] text-white/50">
                          {t.rewards.unlockLabel && `${t.rewards.unlockLabel}. `}
                          {t.rewards.itemBaseId && `Предмет: ${t.rewards.itemBaseId}. `}
                          {t.rewards.title && `Титул: «${t.rewards.title}». `}
                          {t.rewards.gold && `+${t.rewards.gold}g. `}
                        </div>
                      </div>
                      {unlocked && !already && (
                        <button className="btn-primary text-[10px]" onClick={() => claimFactionTier(f.id, t.tier)}>Забрать</button>
                      )}
                      {already && <span className="text-emerald-300 text-[10px]">✓</span>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
