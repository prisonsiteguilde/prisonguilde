import { motion } from "framer-motion";
import { useGame, useDerivedStats } from "../store.js";
import { CLAN_BOSSES } from "@ton-abyss/shared";
import { Icon } from "../components/Icon.js";

export function ClanBosses() {
  const clan = useGame((s) => s.clan);
  const inst = useGame((s) => s.clanBossActive);
  const history = useGame((s) => s.clanBossHistory);
  const startClanBoss = useGame((s) => s.startClanBoss);
  const attackClanBoss = useGame((s) => s.attackClanBoss);
  const claimClanBossRewards = useGame((s) => s.claimClanBossRewards);
  const setScreen = useGame((s) => s.setScreen);
  const derived = useDerivedStats();

  if (!clan) {
    return (
      <div className="px-4 py-4 space-y-4 pb-24">
        <div className="flex items-center gap-2">
          <button onClick={() => setScreen("home")} className="btn-ghost">← Домой</button>
        </div>
        <div className="panel p-6 text-center space-y-2">
          <Icon name="clan" size={48} color="#f0abfc" />
          <div className="text-lg font-bold text-white">Клан-боссы</div>
          <div className="text-sm text-slate-400">Сначала вступите в клан.</div>
          <button className="btn-primary mt-2" onClick={() => setScreen("clan")}>В клан</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <button onClick={() => setScreen("home")} className="btn-ghost">← Домой</button>
      </div>

      <div className="panel p-4 space-y-1 bg-gradient-to-br from-rose-900/30 to-slate-900/80 border border-rose-500/30">
        <div className="text-xs uppercase tracking-widest text-rose-300/80">Клан-боссы</div>
        <div className="text-xl font-bold text-white">{clan.name} · ур. {clan.level}</div>
        <div className="text-xs text-slate-400">Призывайте мировых боссов и сражайтесь всем кланом за добычу.</div>
      </div>

      {inst && (() => {
        const def = CLAN_BOSSES[inst.bossId];
        if (!def) return null;
        const pct = (inst.hpRemaining / def.totalHp) * 100;
        const remaining = Math.max(0, inst.endsAt - Date.now());
        const hours = Math.floor(remaining / 3600_000);
        const myDmg = Object.values(inst.damageByMember).reduce((a, b) => a + b, 0);
        return (
          <div className="panel p-4 space-y-3 border border-rose-500/40 bg-gradient-to-br from-rose-950/50 to-slate-900/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-rose-300/80">Активный босс</div>
                <div className="text-2xl font-bold text-gradient-danger">{def.ru}</div>
                <div className="text-[11px] text-slate-400">{def.description}</div>
              </div>
              {!inst.killed && <BossSvg element={def.element} />}
              {inst.killed && <div className="text-emerald-400 font-bold text-2xl">УБИТ</div>}
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>HP</span>
                <span>{inst.hpRemaining.toLocaleString()} / {def.totalHp.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded bg-slate-900/60 p-2">
                <div className="text-slate-400">До конца</div>
                <div className="font-bold text-amber-300">{hours}ч</div>
              </div>
              <div className="rounded bg-slate-900/60 p-2">
                <div className="text-slate-400">Урон клана</div>
                <div className="font-bold text-rose-300">{(def.totalHp - inst.hpRemaining).toLocaleString()}</div>
              </div>
              <div className="rounded bg-slate-900/60 p-2">
                <div className="text-slate-400">Награда</div>
                <div className="font-bold text-amber-300">{def.killRewards.gold.toLocaleString()}g</div>
              </div>
            </div>
            {!inst.killed ? (
              <button
                className="btn-primary w-full"
                onClick={() => attackClanBoss((derived?.attack ?? 100) * 12)}
              >
                ⚔️ Атаковать ({Math.floor((derived?.attack ?? 100) * 12).toLocaleString()} урона)
              </button>
            ) : (
              <button className="btn-primary w-full" onClick={() => claimClanBossRewards()}>
                Забрать долю награды
              </button>
            )}
          </div>
        );
      })()}

      {!inst && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">Доступные боссы</div>
          {Object.values(CLAN_BOSSES).map((def) => {
            const locked = clan.level < def.minClanRank;
            return (
              <motion.div
                key={def.id}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <BossSvg element={def.element} />
                    <div>
                      <div className="text-base font-bold text-white">{def.ru}</div>
                      <div className="text-[11px] text-slate-400">{def.description}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        HP {def.totalHp.toLocaleString()} · {def.durationHours}ч · {def.phases.length} фаз · мин. ранг клана {def.minClanRank}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={locked}
                    onClick={() => {
                      const r = startClanBoss(def.id);
                      if (!r.ok) alert(r.error);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded ${locked ? "bg-slate-700 text-slate-500" : "bg-rose-500 text-white hover:bg-rose-400"}`}
                  >
                    {locked ? "Ранг низкий" : "Призвать"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {history.length > 0 && (
        <div className="panel p-3 space-y-2">
          <div className="text-sm font-semibold text-slate-200">История</div>
          {history.slice(0, 10).map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{CLAN_BOSSES[h.bossId]?.ru ?? h.bossId}</span>
              <span className={h.killed ? "text-emerald-400" : "text-rose-400"}>{h.killed ? "Убит" : "Сбежал"}</span>
              <span className="text-slate-500">{h.damage.toLocaleString()} урона</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BossSvg({ element }: { element: string }) {
  const colors: Record<string, string> = {
    fire: "#f97316",
    frost: "#38bdf8",
    shock: "#fde047",
    void: "#a855f7",
    holy: "#fef3c7",
    physical: "#94a3b8",
  };
  const c = colors[element] ?? "#94a3b8";
  return (
    <svg width={56} height={56} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`boss-${c}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill={`url(#boss-${c})`} stroke="#0f172a" strokeWidth="2" />
      <path d="M20 28 Q32 16 44 28" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="34" r="3" fill="#0f172a" />
      <circle cx="40" cy="34" r="3" fill="#0f172a" />
      <path d="M22 44 Q32 48 42 44" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
