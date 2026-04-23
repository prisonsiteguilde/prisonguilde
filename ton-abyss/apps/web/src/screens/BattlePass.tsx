import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { CURRENT_SEASON } from "@ton-abyss/content";
import { DEFAULT_DAILY_MISSIONS, DEFAULT_WEEKLY_MISSIONS } from "@ton-abyss/shared";
import { Icon } from "../components/Icon.js";

export function BattlePass() {
  const bp = useGame((s) => s.battlepass);
  const missions = useGame((s) => s.bpMissions);
  const claimBpReward = useGame((s) => s.claimBpReward);
  const purchaseBpPremium = useGame((s) => s.purchaseBpPremium);
  const refreshBpMissions = useGame((s) => s.refreshBpMissions);
  const claimBpMission = useGame((s) => s.claimBpMission);
  const setScreen = useGame((s) => s.setScreen);
  const pushToast = useGame((s) => s.pushToast);

  useEffect(() => {
    refreshBpMissions();
  }, [refreshBpMissions]);

  const tiers = CURRENT_SEASON.tiers;
  const currentTier = useMemo(() => tiers.find((t) => t.level === bp.level), [tiers, bp.level]);
  const nextTier = useMemo(() => tiers.find((t) => t.level === bp.level + 1), [tiers, bp.level]);
  const xpIntoLevel = currentTier ? bp.xp - currentTier.xpRequired : bp.xp;
  const xpNeeded = nextTier ? nextTier.xpRequired - (currentTier?.xpRequired ?? 0) : 0;
  const progressPct = nextTier ? Math.max(0, Math.min(100, (xpIntoLevel / xpNeeded) * 100)) : 100;
  const daysLeft = Math.max(0, Math.ceil((CURRENT_SEASON.endAt - Date.now()) / 86_400_000));

  return (
    <div className="px-4 py-4 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <button onClick={() => setScreen("home")} className="btn-ghost">← Домой</button>
      </div>

      <div className="panel p-4 space-y-3 bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-500/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-purple-300/80">Боевой Пропуск</div>
            <div className="text-2xl font-bold text-white">{CURRENT_SEASON.name}</div>
            <div className="text-xs text-slate-400 mt-1">{CURRENT_SEASON.description}</div>
            <div className="text-xs text-slate-500 mt-1">Осталось: {daysLeft} дн.</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Уровень</div>
            <div className="text-3xl font-bold text-gradient-gold">{bp.level}</div>
            <div className="text-[10px] text-slate-500">/ {tiers.length}</div>
          </div>
        </div>
        <div>
          <div className="h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{xpIntoLevel.toLocaleString()} XP</span>
            <span>{(xpNeeded || 0).toLocaleString()} XP</span>
          </div>
        </div>
        {!bp.premium && (
          <button
            onClick={() => {
              const r = purchaseBpPremium();
              if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
            }}
            className="btn-primary w-full"
          >
            Активировать ПРЕМИУМ за {CURRENT_SEASON.premiumPriceShards} шардов
          </button>
        )}
        {bp.premium && (
          <div className="text-center text-xs text-amber-300 font-semibold">✦ ПРЕМИУМ АКТИВЕН ✦</div>
        )}
      </div>

      {/* Missions */}
      <div className="panel p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="quest" size={18} color="#a3e635" />
          <div className="font-semibold text-white">Миссии</div>
        </div>
        <div className="space-y-2">
          {[...DEFAULT_DAILY_MISSIONS, ...DEFAULT_WEEKLY_MISSIONS].map((m) => {
            const st = missions[m.id];
            const cur = st?.current ?? 0;
            const pct = Math.min(100, (cur / m.objective.amount) * 100);
            return (
              <div key={m.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded mr-2 ${m.kind === "daily" ? "bg-sky-900 text-sky-300" : "bg-violet-900 text-violet-300"}`}>
                        {m.kind === "daily" ? "Дневная" : "Недельная"}
                      </span>
                      {m.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{m.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-amber-300">+{m.rewardXp} XP</div>
                    {st?.claimed ? (
                      <span className="text-[11px] text-emerald-400">Забрано</span>
                    ) : st?.completed ? (
                      <button className="btn-primary text-xs" onClick={() => claimBpMission(m.id)}>Забрать</button>
                    ) : (
                      <div className="text-[10px] text-slate-500">{cur}/{m.objective.amount}</div>
                    )}
                  </div>
                </div>
                <div className="h-1.5 mt-1.5 rounded bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward track */}
      <div className="panel p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Icon name="achievement" size={18} color="#fbbf24" />
          <div className="font-semibold text-white">Награды сезона</div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {tiers.map((t, idx) => {
              const unlocked = bp.level >= t.level;
              const freeClaimed = bp.claimedFree.includes(idx);
              const prClaimed = bp.claimedPremium.includes(idx);
              return (
                <div key={t.level} className="w-28 flex-shrink-0 rounded-lg border border-slate-700 bg-slate-900/50 p-2 space-y-2">
                  <div className="text-center text-xs font-bold text-white">Тир {t.level}</div>
                  <button
                    disabled={!unlocked || freeClaimed || !t.freeReward}
                    onClick={() => claimBpReward(idx, "free")}
                    className={`w-full rounded p-1.5 text-[10px] border ${
                      freeClaimed
                        ? "border-emerald-600/40 bg-emerald-900/30 text-emerald-300"
                        : unlocked
                          ? "border-sky-500 bg-sky-900/40 text-sky-300"
                          : "border-slate-700 bg-slate-900 text-slate-600"
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider">Free</div>
                    <div className="font-semibold">{rewardLabel(t.freeReward)}</div>
                  </button>
                  <button
                    disabled={!unlocked || prClaimed || !bp.premium || !t.premiumReward}
                    onClick={() => claimBpReward(idx, "premium")}
                    className={`w-full rounded p-1.5 text-[10px] border ${
                      prClaimed
                        ? "border-emerald-600/40 bg-emerald-900/30 text-emerald-300"
                        : unlocked && bp.premium
                          ? "border-amber-500 bg-amber-900/40 text-amber-300"
                          : "border-slate-700 bg-slate-900 text-slate-600"
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider">Premium</div>
                    <div className="font-semibold">{rewardLabel(t.premiumReward)}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function rewardLabel(r?: import("@ton-abyss/shared").BattlePassReward): string {
  if (!r) return "—";
  switch (r.kind) {
    case "gold": return `${r.amount}g`;
    case "shards": return `${r.amount} шардов`;
    case "abyss_dust": return `${r.amount} пыли`;
    case "lootbox": return r.baseId === "lb_abyss" ? "Сундук Бездны" : r.baseId === "lb_gold" ? "Золот. сундук" : r.baseId === "lb_silver" ? "Серебр. сундук" : "Сундук";
    case "pet": return "Питомец";
    case "mount": return "Скакун";
    case "transmog": return "Трансмог";
    case "title": return "Титул";
    case "skill_point": return `+${r.amount} очк. навыков`;
    case "rune": return "Руна";
    case "item": return "Предмет";
  }
}
