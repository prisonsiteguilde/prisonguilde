import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import type { ItemInstance, ItemSlot } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { EmptyState } from "../components/EmptyState.js";

type TabId = "weapons" | "armor" | "trinkets" | "consumables" | "materials" | "other";

const TABS: { id: TabId; label: string; icon: string; slots: ItemSlot[] }[] = [
  { id: "weapons", label: "Оружие", icon: "⚔️", slots: ["weapon", "offhand"] },
  { id: "armor", label: "Броня", icon: "🛡️", slots: ["head", "chest", "legs", "hands", "feet"] },
  { id: "trinkets", label: "Реликвии", icon: "💍", slots: ["ring", "amulet", "relic"] },
  { id: "consumables", label: "Расходники", icon: "🧪", slots: ["consumable"] },
  { id: "materials", label: "Материалы", icon: "📦", slots: ["material", "rune"] },
  { id: "other", label: "Прочее", icon: "📜", slots: ["pet_egg", "key"] },
];

export function Stash() {
  const stash = useGame((s) => s.stash);
  const inventory = useGame((s) => s.inventory);
  const moveToStash = useGame((s) => s.moveToStash);
  const takeFromStash = useGame((s) => s.takeFromStash);
  const [tab, setTab] = useState<TabId>("weapons");
  const [view, setView] = useState<"stash" | "inv">("stash");

  const currentTab = TABS.find((t) => t.id === tab)!;
  const source = view === "stash" ? stash : inventory;
  const filtered = source.filter((it) => {
    const base = ITEMS[it.baseId];
    if (!base) return false;
    return currentTab.slots.includes(base.slot);
  });

  return (
    <ScreenLayout title="Стэш" subtitle={`${stash.length} предм. в стерильном хранилище`} accent="#94a3b8">

      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap ${tab === t.id ? "bg-abyss-500/40 text-white" : "bg-black/30 text-white/60"}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className={`flex-1 px-3 py-1.5 rounded text-xs ${view === "stash" ? "bg-slate-500/30 text-white border border-slate-400/40" : "bg-black/30 text-white/60"}`}
          onClick={() => setView("stash")}
        >
          🗃️ Стэш ({stash.length})
        </button>
        <button
          className={`flex-1 px-3 py-1.5 rounded text-xs ${view === "inv" ? "bg-emerald-500/30 text-white border border-emerald-400/40" : "bg-black/30 text-white/60"}`}
          onClick={() => setView("inv")}
        >
          🎒 Инвентарь ({inventory.length})
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-xs text-white/40 text-center py-8">Пусто в этой категории.</div>}
        {filtered.map((it) => {
          const base = ITEMS[it.baseId];
          if (!base) return null;
          return (
            <motion.div key={it.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-2 flex items-center justify-between">
              <div>
                <div className={`text-sm rarity-${it.rarity}`}>{base.name}</div>
                <div className="text-[10px] text-white/40">Lv {it.level} · {it.rarity}{it.upgradeLevel > 0 && ` +${it.upgradeLevel}`}</div>
              </div>
              {view === "stash"
                ? <button className="btn-ghost text-xs" onClick={() => takeFromStash(it.uid)}>Забрать</button>
                : <button className="btn-ghost text-xs" onClick={() => moveToStash(it.uid)}>В стэш</button>}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon="chest" title="Пусто" hint="Стэш безлимитный — храните запасные сеты." />
      )}
      <div className="text-caption text-center px-4">
        Стэш безлимитный. Используйте для хранения запасных сетов и редких предметов.
      </div>
    </ScreenLayout>
  );
}
