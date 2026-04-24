import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { BOUNTIES_POOL, BOUNTY_REROLL_COST, FACTIONS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Bounties() {
  const bounties = useGame((s) => s.bounties);
  const refreshBountiesIfNeeded = useGame((s) => s.refreshBountiesIfNeeded);
  const rerollBounties = useGame((s) => s.rerollBounties);
  const claimBounty = useGame((s) => s.claimBounty);

  useEffect(() => { refreshBountiesIfNeeded(); }, [refreshBountiesIfNeeded]);

  return (
    <ScreenLayout title="Доска контрактов" subtitle={`Выполнено сегодня: ${bounties.completedToday}`} back="home" accent="#a3e635">
      <div className="card-flat p-3 flex items-center justify-between">
        <div className="text-caption text-white/70">Активных: <b className="text-white/95">{bounties.active.length}</b></div>
        <button className="btn-ghost text-caption press" onClick={() => rerollBounties()}>Рефрешнуть ({BOUNTY_REROLL_COST}g)</button>
      </div>

      <div className="space-y-2">
        {bounties.active.length === 0 && <div className="text-xs text-white/50 px-2">Нет доступных контрактов.</div>}
        {bounties.active.map((b) => {
          const def = BOUNTIES_POOL.find((x) => x.id === b.id);
          if (!def) return null;
          const faction = def.faction ? FACTIONS[def.faction] : null;
          const expiresIn = Math.max(0, Math.floor((b.expiresAt - Date.now()) / 3600_000));
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-3 ${b.claimed ? "opacity-50" : def.difficulty >= 4 ? "border-rose-400/40" : def.difficulty === 3 ? "border-amber-400/40" : "border-white/10"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-lg tracking-wider">{def.name}</div>
                    <span className="chip text-[9px]" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fcd34d" }}>Сложн. {def.difficulty}/5</span>
                    {faction && <span className="chip text-[9px]" style={{ backgroundColor: faction.color + "22", color: faction.color }}>{faction.icon} {faction.shortName}</span>}
                  </div>
                  <div className="text-xs text-white/60">{def.description}</div>
                  <div className="text-[11px] text-white/40 mt-1">
                    Награда: {def.rewards.gold}g, {def.rewards.xp}xp
                    {def.rewards.reputation && `, +${def.rewards.reputation.amount} реп. ${FACTIONS[def.rewards.reputation.factionId]?.shortName}`}
                    {def.rewards.dust && `, ${def.rewards.dust} пыли`}
                    {def.rewards.shards && `, ${def.rewards.shards} шардов`}
                  </div>
                  <div className="text-[10px] text-white/30">Истекает через ~{expiresIn}ч</div>
                </div>
                <div>
                  {b.claimed
                    ? <span className="text-xs text-emerald-300">✓ Забрано</span>
                    : <button className="btn-primary text-xs" onClick={() => claimBounty(b.id)}>Забрать</button>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
