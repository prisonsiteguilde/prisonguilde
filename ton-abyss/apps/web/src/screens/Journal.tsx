import { useGame } from "../store.js";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { useState } from "react";

const KIND_META: Record<string, { color: string; emoji: string }> = {
  kill: { color: "#ef4444", emoji: "⚔" },
  boss: { color: "#a855f7", emoji: "👑" },
  loot: { color: "#f59e0b", emoji: "💎" },
  craft: { color: "#06b6d4", emoji: "🔨" },
  sell: { color: "#10b981", emoji: "💰" },
  level: { color: "#eab308", emoji: "⭐" },
  death: { color: "#64748b", emoji: "💀" },
  pet: { color: "#ec4899", emoji: "🐾" },
  default: { color: "#94a3b8", emoji: "📜" },
};

function fmt(at: number): string {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function Journal() {
  const journal = useGame((s) => s.journal);
  const clearJournal = useGame((s) => s.clearJournal);
  const [filter, setFilter] = useState<string>("all");
  const kinds = Array.from(new Set(journal.map((j) => j.kind)));
  const filtered = filter === "all" ? journal : journal.filter((j) => j.kind === filter);

  return (
    <ScreenLayout
      title="Журнал"
      subtitle={`${journal.length} записей (макс. 200)`}
      back="home"
      accent="#a855f7"
      action={journal.length > 0 ? (
        <button onClick={clearJournal} className="text-caption text-rose-300 hover:text-rose-200">
          Очистить
        </button>
      ) : undefined}
    >
      <div className="seg">
        <button className={`seg-item ${filter === "all" ? "seg-active" : ""}`} onClick={() => setFilter("all")}>Все</button>
        {kinds.map((k) => (
          <button key={k} className={`seg-item ${filter === k ? "seg-active" : ""}`} onClick={() => setFilter(k)}>
            {(KIND_META[k] ?? KIND_META.default)!.emoji} {k}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="card-ghost p-6 text-center text-caption text-white/50">
          Журнал пуст. Записи появятся по ходу игры.
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((j) => {
            const meta = KIND_META[j.kind] ?? KIND_META.default;
            return (
              <div key={j.id} className="card-flat p-3 flex items-start gap-3">
                <div className="text-[20px] shrink-0 pt-0.5" style={{ color: meta!.color }}>{meta!.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-body">{j.text}</div>
                  <div className="text-micro text-white/40 mt-0.5">{fmt(j.at)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ScreenLayout>
  );
}
