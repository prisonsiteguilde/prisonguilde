import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { SKILLS } from "@ton-abyss/content";
import { CLASS_CONFIG } from "@ton-abyss/shared";

export function SkillTree() {
  const setScreen = useGame((s) => s.setScreen);
  const character = useGame((s) => s.character)!;
  const skillAllocation = useGame((s) => s.skillAllocation);
  const skillPoints = useGame((s) => s.skillPoints);
  const paragon = useGame((s) => s.paragon);
  const paragonPoints = useGame((s) => s.paragonPoints);
  const allocateSkill = useGame((s) => s.allocateSkill);
  const resetSkills = useGame((s) => s.resetSkills);
  const allocateParagon = useGame((s) => s.allocateParagon);

  const classSkills = Object.values(SKILLS).filter((n) => n.classId === character.classId);
  const byTier = [1, 2, 3, 4].map((t) => classSkills.filter((s) => s.tier === t));

  return (
    <div className="px-4 py-4 space-y-4 pb-28">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Дерево Навыков</h2>
        <button onClick={resetSkills} className="btn-ghost text-xs">Сброс (2000💰)</button>
      </div>

      <div className="card p-3 flex items-center gap-3">
        <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${CLASS_CONFIG[character.classId].color})` }}>
          {CLASS_CONFIG[character.classId].emoji}
        </div>
        <div className="flex-1">
          <div className="font-display text-lg" style={{ color: CLASS_CONFIG[character.classId].color }}>
            {CLASS_CONFIG[character.classId].name}
          </div>
          <div className="text-[11px] text-white/60">Очков навыков: <b className="text-emerald-300">{skillPoints}</b></div>
        </div>
      </div>

      {byTier.map((nodes, i) => (
        <div key={i}>
          <div className="panel-title mb-2">Тир {i + 1} <span className="text-[10px] text-white/40">(ур. {[1, 8, 18, 35][i]}+)</span></div>
          <div className="grid grid-cols-2 gap-2">
            {nodes.map((node) => {
              const rank = skillAllocation[node.id] ?? 0;
              const maxed = rank >= node.maxRank;
              const reqOk = !node.requires || node.requires.every((r) => (skillAllocation[r] ?? 0) >= 1);
              const disabled = maxed || skillPoints < 1 || !reqOk;
              return (
                <motion.button
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  disabled={disabled}
                  onClick={() => allocateSkill(node.id)}
                  className={`card p-3 text-left text-[11px] ${
                    rank > 0 ? "border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : ""
                  } ${disabled && rank === 0 ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display text-sm tracking-wider">{node.name}</div>
                    <div className="text-amber-300 font-bold">{rank}/{node.maxRank}</div>
                  </div>
                  <div className="text-white/60 text-[10px] mt-1">{node.description}</div>
                  <div className="mt-1 text-[9px] text-white/40">
                    {node.kind === "active" ? "Активный" : "Пассивный"}
                    {node.requires && ` · треб.: ${node.requires.map((r) => SKILLS[r]?.name).join(", ")}`}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="card p-3 mt-4 border-amber-400/40">
        <div className="panel-title text-amber-200 mb-2">Парагон ({paragonPoints} очков)</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(["offense", "defense", "utility", "treasure"] as const).map((k) => (
            <button key={k} onClick={() => allocateParagon(k)} disabled={paragonPoints < 1}
              className="card p-2 text-left">
              <div className="font-bold capitalize">{k}</div>
              <div className="text-white/60 text-[10px]">ранг: {paragon[k]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
