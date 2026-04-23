import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { EXPEDITIONS, PETS } from "@ton-abyss/content";

export function Expeditions() {
  const setScreen = useGame((s) => s.setScreen);
  const expeditions = useGame((s) => s.expeditions);
  const pets = useGame((s) => s.pets);
  const sendExpedition = useGame((s) => s.sendExpedition);
  const claimExpedition = useGame((s) => s.claimExpedition);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Экспедиции питомцев</h2>
        <span className="w-16" />
      </div>

      {expeditions.active.length > 0 && (
        <div className="card p-3">
          <div className="font-display text-lg mb-2">Активные</div>
          <div className="space-y-2">
            {expeditions.active.map((a) => {
              const def = EXPEDITIONS.find((e) => e.id === a.expId);
              const pet = pets.find((p) => p.uid === a.petUid);
              const remaining = Math.max(0, a.endsAt - Date.now());
              const totalDur = def ? def.durationMinutes * 60000 : 1;
              const progress = 1 - remaining / totalDur;
              const done = remaining <= 0;
              return (
                <div key={a.id} className="rounded-lg bg-black/30 p-2 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm">{def?.name ?? a.expId}</div>
                      <div className="text-[10px] text-white/50">Питомец: {pet?.nickname ?? pet?.defId ?? "?"}</div>
                    </div>
                    {done
                      ? <button className="btn-primary text-xs" onClick={() => claimExpedition(a.id)}>Забрать</button>
                      : <div className="text-xs text-amber-300">{formatDuration(remaining)}</div>}
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-black/60 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${Math.min(1, progress) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs text-white/50 px-1">Доступные экспедиции</div>
        {EXPEDITIONS.map((e) => {
          const busyPets = new Set(expeditions.active.map((a) => a.petUid));
          const availablePets = pets.filter((p) => !busyPets.has(p.uid) && p.level >= e.petLevelReq);
          return (
            <div key={e.id} className="card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-display text-lg">{e.name}</div>
                  <div className="text-xs text-white/60">{e.description}</div>
                  {e.flavor && <div className="text-[11px] italic text-white/40 mt-1">{e.flavor}</div>}
                  <div className="text-[11px] text-white/50 mt-1">
                    {e.durationMinutes}мин · Ур.{e.petLevelReq}+ · Успех: {Math.floor(e.successBaseChance * 100)}%
                  </div>
                  <div className="text-[11px] text-white/40">
                    Лут: {e.rewards.gold[0]}-{e.rewards.gold[1]}g, {e.rewards.xp[0]}-{e.rewards.xp[1]}xp
                    {e.rewards.itemChance && `, шанс предмета ${Math.floor(e.rewards.itemChance * 100)}%`}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {availablePets.length === 0
                    ? <span className="text-xs text-red-300">Нет питомцев</span>
                    : (
                      <select
                        className="bg-black/40 border border-white/20 rounded px-2 py-1 text-xs"
                        defaultValue=""
                        onChange={(ev) => {
                          if (ev.target.value) {
                            const r = sendExpedition(e.id, ev.target.value);
                            if (!r.ok && r.error) alert(r.error);
                          }
                        }}
                      >
                        <option value="">Выбрать питомца</option>
                        {availablePets.map((p) => {
                          const def = PETS[p.defId];
                          return <option key={p.uid} value={p.uid}>{p.nickname ?? def?.name ?? p.defId} (ур.{p.level})</option>;
                        })}
                      </select>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {expeditions.history.length > 0 && (
        <div className="card p-3">
          <div className="font-display text-lg mb-1">История</div>
          <div className="space-y-1 text-[11px] text-white/60">
            {expeditions.history.slice(-5).reverse().map((h, i) => (
              <div key={i}>• {EXPEDITIONS.find((e) => e.id === h.expId)?.name ?? h.expId}: {h.success ? "✓ успех" : "✗ провал"}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}с`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}м ${s % 60}с`;
  return `${Math.floor(m / 60)}ч ${m % 60}м`;
}
