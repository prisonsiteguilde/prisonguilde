import { useGame } from "../store.js";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { useState } from "react";

const SLOT_NAMES: Record<number, string> = {
  0: "DPS", 1: "Танк", 2: "PvP", 3: "Фарм",
};

export function Loadouts() {
  const loadouts = useGame((s) => s.loadouts);
  const saveLoadout = useGame((s) => s.saveLoadout);
  const loadLoadout = useGame((s) => s.loadLoadout);
  const deleteLoadout = useGame((s) => s.deleteLoadout);
  const equipped = useGame((s) => s.equipped);
  const inventory = useGame((s) => s.inventory);
  const pushToast = useGame((s) => s.pushToast);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");

  const slots = [0, 1, 2, 3];

  return (
    <ScreenLayout title="Комплекты" subtitle="4 слота, быстрое переключение" back="inventory" accent="#06b6d4">
      {slots.map((slot) => {
        const ld = loadouts[slot];
        const hint = SLOT_NAMES[slot] ?? `Слот ${slot + 1}`;
        return (
          <div key={slot} className="card-elevated p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-micro text-cyan-300/70">Слот {slot + 1} · {hint}</div>
                <div className="text-title">{ld?.name ?? "— пусто —"}</div>
              </div>
              {ld && (
                <button
                  onClick={() => deleteLoadout(slot)}
                  className="text-caption text-rose-300 hover:text-rose-200"
                >
                  × удалить
                </button>
              )}
            </div>
            {ld && (
              <div className="text-micro text-white/60 mb-2">
                Предметов: {Object.values(ld.equipped).filter(Boolean).length}
                {" · доступно: "}
                {Object.values(ld.equipped).filter((u) => u && inventory.find((i) => i.uid === u)).length}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (ld) {
                    const r = loadLoadout(slot);
                    if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
                  } else {
                    pushToast({ text: "Слот пуст.", tone: "bad" });
                  }
                }}
                className="btn-secondary py-2 text-caption disabled:opacity-40"
                disabled={!ld}
              >
                Надеть
              </button>
              <button
                onClick={() => {
                  setEditingSlot(slot);
                  setNameInput(ld?.name ?? hint);
                }}
                className="btn-primary py-2 text-caption"
              >
                {ld ? "Переписать" : "Сохранить текущий"}
              </button>
            </div>
            {editingSlot === slot && (
              <div className="mt-2 flex gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-caption"
                  placeholder="Название"
                  maxLength={20}
                />
                <button
                  onClick={() => {
                    const r = saveLoadout(slot, nameInput.trim() || hint);
                    if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
                    setEditingSlot(null);
                  }}
                  className="btn-primary px-3 py-1.5 text-caption"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        );
      })}
      <div className="card-ghost p-3 text-caption text-white/50">
        Текущая экипировка: {Object.values(equipped).filter(Boolean).length} предметов надето.
      </div>
    </ScreenLayout>
  );
}
