import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { QUESTS } from "@ton-abyss/content";
import type { QuestObjective } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";

function objectiveLabel(o: QuestObjective): string {
  const t = o.target === "any" ? "любой цели" : o.target;
  switch (o.kind) {
    case "kill_monster": return `Убить монстров (${t})`;
    case "kill_boss": return `Убить босса (${t})`;
    case "clear_dungeon": return `Зачистить данж (${t})`;
    case "collect_material": return `Собрать ${t}`;
    case "craft_item": return `Скрафтить ${t}`;
    case "reach_level": return `Достичь уровня ${o.amount}`;
    case "deal_damage": return `Нанести урон (${t})`;
    default: return o.kind;
  }
}

export function Quests() {
  const quests = useGame((s) => s.quests);
  const claimQuest = useGame((s) => s.claimQuest);
  const acceptQuest = useGame((s) => s.acceptQuest);

  const all = Object.values(QUESTS);
  const active = Object.values(quests).filter((q: { status: string }) => q.status === "active").length;

  return (
    <ScreenLayout title="Задания" subtitle={`${active} активных из ${all.length}`} back="home" accent="#84cc16">

      <div className="space-y-2">
        {all.map((q) => {
          const qp = quests[q.id];
          const status = qp?.status ?? "not_taken";
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-3 ${q.kind === "main" ? "border-amber-400/40" : q.kind === "daily" ? "border-emerald-400/40" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg tracking-wider">
                    {q.name}{" "}
                    <span className="text-[10px] text-white/50 normal-case tracking-normal">
                      [{q.kind}] ур.{q.levelMin}+
                    </span>
                  </div>
                  <div className="text-xs text-white/60">{q.description}</div>
                </div>
                <div className="text-xs">
                  {status === "claimed" && <span className="text-white/40">✓ Завершён</span>}
                  {status === "completed" && (
                    <button className="btn-primary" onClick={() => claimQuest(q.id)}>Забрать</button>
                  )}
                  {status === "active" && <span className="text-cyan-300">В процессе</span>}
                  {status === "not_taken" && (
                    <button className="btn-ghost text-xs" onClick={() => acceptQuest(q.id)}>Принять</button>
                  )}
                </div>
              </div>

              <div className="mt-2 space-y-1">
                {q.objectives.map((o) => {
                  const cur = qp?.objectives[o.id] ?? 0;
                  const done = cur >= o.amount;
                  return (
                    <div key={o.id} className="flex items-center gap-2 text-[11px]">
                      <span className={done ? "text-emerald-300" : "text-white/60"}>{done ? "✓" : "○"}</span>
                      <span className="flex-1">{objectiveLabel(o)}</span>
                      <span className="text-white/50 font-mono">{cur}/{o.amount}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 text-[10px] text-white/50">
                Награда:{" "}
                {q.rewards.gold && <span>{q.rewards.gold}💰 </span>}
                {q.rewards.xp && <span>{q.rewards.xp} XP </span>}
                {q.rewards.shards && <span>{q.rewards.shards} шардов </span>}
                {q.rewards.abyssDust && <span>{q.rewards.abyssDust} пыли </span>}
                {q.rewards.skillPoints && <span>+{q.rewards.skillPoints} очк.навыков </span>}
                {q.rewards.title && <span>· титул «{q.rewards.title}» </span>}
                {q.rewards.items && q.rewards.items.map((i, idx) => <span key={idx}>{i.baseId} x{i.qty}</span>)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
