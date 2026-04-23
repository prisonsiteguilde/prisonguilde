import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { PETS } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";

export function Pets() {
  const setScreen = useGame((s) => s.setScreen);
  const pets = useGame((s) => s.pets);
  const petStates = useGame((s) => s.petStates);
  const materials = useGame((s) => s.materials);
  const activePetUid = useGame((s) => s.activePetUid);
  const feedPet = useGame((s) => s.feedPet);
  const evolvePet = useGame((s) => s.evolvePet);
  const fusePets = useGame((s) => s.fusePets);
  const hatchEgg = useGame((s) => s.hatchEgg);
  const inventory = useGame((s) => s.inventory);
  const set = useGame.setState;
  const [fuseMode, setFuseMode] = useState<string | null>(null);
  const [tab, setTab] = useState<"mine" | "catalog">("mine");

  const eggs = inventory.filter((i) => i.baseId.startsWith("pet_egg"));

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Питомцы</h2>
        <span className="w-16" />
      </div>

      <div className="flex gap-2">
        <button className={`flex-1 px-3 py-2 rounded text-sm ${tab === "mine" ? "bg-pink-500/30 border border-pink-400/40" : "bg-black/30"}`} onClick={() => setTab("mine")}>
          Мои ({pets.length})
        </button>
        <button className={`flex-1 px-3 py-2 rounded text-sm ${tab === "catalog" ? "bg-indigo-500/30 border border-indigo-400/40" : "bg-black/30"}`} onClick={() => setTab("catalog")}>
          Каталог
        </button>
      </div>

      {tab === "mine" && (
        <>
          {eggs.length > 0 && (
            <div className="card p-3 border-amber-400/40">
              <div className="font-display text-lg text-amber-200 mb-1">🥚 Яйца</div>
              <div className="space-y-1">
                {eggs.map((e) => (
                  <div key={e.uid} className="flex items-center justify-between">
                    <div className="text-xs">{e.baseId}</div>
                    <button className="btn-primary text-xs" onClick={() => hatchEgg(e.baseId)}>Вылупить</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pets.length === 0 && (
            <div className="card p-4 text-center text-white/60">
              Питомцев нет. Найдите яйцо в данжах или у боссов.
            </div>
          )}

          <div className="space-y-2">
            {pets.map((p) => {
              const def = PETS[p.defId];
              const state = petStates[p.uid] ?? { happiness: 50, lastFedAt: 0, stage: 1, skillPoints: 0 };
              const stageLabels = ["", "Детёныш", "Взрослый", "Apex"];
              const isActive = activePetUid === p.uid;
              const feedMaterials = def ? Object.keys(def.feedTable) : [];
              return (
                <motion.div
                  key={p.uid}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card p-3 ${isActive ? "border-amber-400/50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" style={{ filter: `drop-shadow(0 0 10px ${def ? RARITY_COLOR[def.rarity] : "#fff"})` }}>
                      {iconFor(def?.family ?? "beast")}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-lg" style={{ color: def ? RARITY_COLOR[def.rarity] : "#fff" }}>
                        {p.nickname ?? def?.name} <span className="text-xs text-white/50">Lv {p.level}</span>
                      </div>
                      <div className="text-[10px] text-white/60 uppercase tracking-widest">{stageLabels[state.stage]} · связь {p.bondLevel}/10 · {def?.element}</div>
                      <div className="mt-1 flex items-center gap-1 text-[10px]">
                        <span>😊</span>
                        <div className="flex-1 h-1.5 rounded bg-black/40 overflow-hidden">
                          <div className="h-full bg-pink-400" style={{ width: `${state.happiness}%` }} />
                        </div>
                        <span className="text-white/50">{state.happiness}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className={`text-[10px] px-2 py-0.5 rounded ${isActive ? "bg-amber-500/40 text-amber-200" : "bg-black/30 text-white/60"}`} onClick={() => set({ activePetUid: isActive ? null : p.uid })}>
                        {isActive ? "Активен" : "Взять"}
                      </button>
                      <button className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-500/30 text-fuchsia-200" onClick={() => { const r = evolvePet(p.uid); if (!r.ok && r.error) useGame.getState().pushToast({ text: r.error, tone: "bad" }); }}>
                        Эвол.
                      </button>
                    </div>
                  </div>

                  {feedMaterials.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {feedMaterials.slice(0, 4).map((m) => (
                        <button
                          key={m}
                          disabled={(materials[m] ?? 0) < 1}
                          className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 disabled:opacity-40"
                          onClick={() => feedPet(p.uid, m)}
                        >
                          🍖 {m} ({materials[m] ?? 0})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Fuse */}
                  {fuseMode === p.uid ? (
                    <div className="mt-2 text-[10px] text-white/60">Выберите вторую цель того же вида для слияния.</div>
                  ) : null}
                  {fuseMode && fuseMode !== p.uid && (() => {
                    const other = pets.find((x) => x.uid === fuseMode);
                    if (other && other.defId === p.defId) {
                      return (
                        <button
                          className="mt-2 w-full text-[10px] px-2 py-1 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40"
                          onClick={() => { fusePets(fuseMode!, p.uid); setFuseMode(null); }}
                        >
                          Слить с {other.nickname ?? PETS[other.defId]?.name} → Apex
                        </button>
                      );
                    }
                    return null;
                  })()}
                  <button
                    className="mt-2 w-full text-[10px] px-2 py-0.5 rounded bg-black/30 text-white/50"
                    onClick={() => setFuseMode(fuseMode === p.uid ? null : p.uid)}
                  >
                    {fuseMode === p.uid ? "Отмена слияния" : "Слить..."}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tab === "catalog" && (
        <div className="space-y-2">
          <div className="text-xs text-white/50 px-1">Все возможные виды питомцев</div>
          {Object.values(PETS).map((p) => (
            <motion.div whileHover={{ y: -2 }} key={p.id} className="card p-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl" style={{ filter: `drop-shadow(0 0 10px ${RARITY_COLOR[p.rarity]})` }}>{iconFor(p.family)}</div>
                <div className="flex-1">
                  <div className="font-display text-base" style={{ color: RARITY_COLOR[p.rarity] }}>{p.name}</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest">{p.rarity} · {p.family} · {p.element}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.passives.map((t, i) => <span key={i} className="chip text-[9px]">{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function iconFor(family: string): string {
  switch (family) {
    case "wyrm": return "🐉";
    case "golem": return "🗿";
    case "spirit": return "👻";
    case "beast": return "🐺";
    case "construct": return "⚙️";
    case "abyssal": return "🕷️";
    default: return "🐾";
  }
}
