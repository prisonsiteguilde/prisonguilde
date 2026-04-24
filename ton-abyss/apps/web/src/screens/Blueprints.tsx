import { useMemo, useState } from "react";
import { useGame } from "../store.js";
import { RECIPES, ITEMS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

const SOURCE_LABEL: Record<string, string> = {
  default: "Доступен сразу",
  drop: "Дропает с боссов",
  quest: "Награда квеста",
  reputation: "Репутация фракции",
};

const SOURCE_COLOR: Record<string, string> = {
  default: "#10b981",
  drop: "#f59e0b",
  quest: "#a855f7",
  reputation: "#38bdf8",
};

export function Blueprints() {
  const character = useGame((s) => s.character);
  const materials = useGame((s) => s.materials);
  const setScreen = useGame((s) => s.setScreen);
  const [filter, setFilter] = useState<"all" | "ready" | "missing" | "locked">("all");
  const [tierFilter, setTierFilter] = useState<number | "all">("all");

  const recipes = useMemo(() => Object.values(RECIPES), []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (tierFilter !== "all" && r.stationTier !== tierFilter) return false;
      if (filter === "ready") {
        const hasMats = r.inputs.every((i) => (materials[i.baseId] ?? 0) >= i.qty);
        const hasGold = (character?.gold ?? 0) >= r.goldCost;
        return hasMats && hasGold && r.unlockedBy === "default";
      }
      if (filter === "missing") {
        return r.unlockedBy === "default" && !r.inputs.every((i) => (materials[i.baseId] ?? 0) >= i.qty);
      }
      if (filter === "locked") {
        return r.unlockedBy !== "default";
      }
      return true;
    }).sort((a, b) => a.stationTier - b.stationTier || a.outputLevel - b.outputLevel);
  }, [recipes, filter, tierFilter, materials, character]);

  if (!character) return null;

  const totalUnlocked = recipes.filter((r) => r.unlockedBy === "default").length;
  const totalReady = recipes.filter((r) => {
    if (r.unlockedBy !== "default") return false;
    return r.inputs.every((i) => (materials[i.baseId] ?? 0) >= i.qty) && character.gold >= r.goldCost;
  }).length;

  return (
    <ScreenLayout
      title="Блюпринты"
      subtitle={`${totalUnlocked} открыто · ${totalReady} готово к крафту`}
      accent="#a855f7"
      action={
        <button onClick={() => setScreen("crafting")} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-200">
          → Кузня
        </button>
      }
    >
      <div className="card-elevated p-3 space-y-3">
        <div className="seg">
          {([
            ["all", "Все"],
            ["ready", "Готовы"],
            ["missing", "Нехватка"],
            ["locked", "Закрыты"],
          ] as const).map(([k, lbl]) => (
            <button key={k} className={`seg-item ${filter === k ? "seg-item-active" : ""}`} onClick={() => setFilter(k)}>{lbl}</button>
          ))}
        </div>
        <div className="seg">
          <button className={`seg-item ${tierFilter === "all" ? "seg-item-active" : ""}`} onClick={() => setTierFilter("all")}>Все T</button>
          {[1, 2, 3, 4, 5].map((t) => (
            <button key={t} className={`seg-item ${tierFilter === t ? "seg-item-active" : ""}`} onClick={() => setTierFilter(t)}>T{t}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card-flat p-6 text-center text-caption text-white/50">Нет рецептов по этим фильтрам.</div>
        ) : filtered.map((r) => {
          const out = ITEMS[r.outputBaseId];
          const isLocked = r.unlockedBy !== "default";
          const matStatus = r.inputs.map((inp) => ({
            ...inp,
            have: materials[inp.baseId] ?? 0,
            ok: (materials[inp.baseId] ?? 0) >= inp.qty,
          }));
          const goldOk = character.gold >= r.goldCost;
          const allReady = !isLocked && matStatus.every((m) => m.ok) && goldOk;
          return (
            <div key={r.id} className={`card-elevated p-3 ${allReady ? "ring-1 ring-emerald-500/30" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-title">{r.name}</span>
                    <span className="text-micro text-amber-300/70">T{r.stationTier}</span>
                    <span className="text-micro text-white/40">ур.{r.outputLevel}</span>
                  </div>
                  <div className="text-caption text-white/55 mt-0.5">→ {out?.name ?? r.outputBaseId}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {matStatus.map((m) => (
                      <span
                        key={m.baseId}
                        className={`text-micro px-1.5 py-0.5 rounded ${m.ok ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"}`}
                      >
                        {ITEMS[m.baseId]?.name ?? m.baseId} {m.have}/{m.qty}
                      </span>
                    ))}
                    <span className={`text-micro px-1.5 py-0.5 rounded ${goldOk ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"}`}>
                      {r.goldCost}g
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="text-micro px-1.5 py-0.5 rounded inline-block"
                    style={{
                      background: SOURCE_COLOR[r.unlockedBy ?? "default"] + "22",
                      color: SOURCE_COLOR[r.unlockedBy ?? "default"],
                      border: `1px solid ${SOURCE_COLOR[r.unlockedBy ?? "default"]}55`,
                    }}
                  >
                    {SOURCE_LABEL[r.unlockedBy ?? "default"]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-caption text-white/40 text-center pt-2">
        Закрытые блюпринты открываются после убийства определённых боссов или достижения репутации с фракциями.
      </div>
    </ScreenLayout>
  );
}
