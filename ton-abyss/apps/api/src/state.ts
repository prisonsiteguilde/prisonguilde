import type { Character, ItemInstance, PetInstance } from "@ton-abyss/shared";
import { db, nowMs } from "./db.js";

export interface FullState {
  character: Character;
  inventory: ItemInstance[];
  equipped: Record<string, string | null>;
  materials: Record<string, number>;
  pets: PetInstance[];
  activePetUid?: string;
}

const KEY_EQUIPPED = "__equipped__";

export function loadState(userId: string): FullState | null {
  const charRow = db.prepare("SELECT * FROM characters WHERE user_id = ?").get(userId) as any;
  if (!charRow) return null;
  const character = JSON.parse(charRow.data) as Character;
  const invRows = db.prepare("SELECT * FROM inventory WHERE char_id = ?").all(charRow.id) as any[];
  const inventory: ItemInstance[] = [];
  let equipped: Record<string, string | null> = {};
  for (const r of invRows) {
    if (r.uid === KEY_EQUIPPED) {
      equipped = JSON.parse(r.data);
    } else {
      inventory.push(JSON.parse(r.data));
    }
  }
  const matRows = db.prepare("SELECT * FROM materials WHERE char_id = ?").all(charRow.id) as any[];
  const materials: Record<string, number> = {};
  for (const m of matRows) materials[m.base_id] = m.qty;
  const petRows = db.prepare("SELECT * FROM pets WHERE char_id = ?").all(charRow.id) as any[];
  const pets: PetInstance[] = petRows.map((p) => JSON.parse(p.data));
  return { character, inventory, equipped, materials, pets };
}

export function saveState(userId: string, state: FullState): void {
  let charRow = db.prepare("SELECT id FROM characters WHERE user_id = ?").get(userId) as any;
  if (!charRow) {
    charRow = { id: state.character.id };
    db.prepare(
      "INSERT INTO characters (id, user_id, data, updated_at) VALUES (?, ?, ?, ?)",
    ).run(state.character.id, userId, JSON.stringify(state.character), nowMs());
  } else {
    db.prepare("UPDATE characters SET data = ?, updated_at = ? WHERE id = ?").run(
      JSON.stringify(state.character),
      nowMs(),
      charRow.id,
    );
  }
  const charId = charRow.id;
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM inventory WHERE char_id = ?").run(charId);
    const insItem = db.prepare("INSERT INTO inventory (char_id, uid, base_id, data) VALUES (?, ?, ?, ?)");
    for (const it of state.inventory) {
      insItem.run(charId, it.uid, it.baseId, JSON.stringify(it));
    }
    insItem.run(charId, KEY_EQUIPPED, KEY_EQUIPPED, JSON.stringify(state.equipped ?? {}));

    db.prepare("DELETE FROM materials WHERE char_id = ?").run(charId);
    const insMat = db.prepare("INSERT INTO materials (char_id, base_id, qty) VALUES (?, ?, ?)");
    for (const [bid, qty] of Object.entries(state.materials)) {
      if (qty > 0) insMat.run(charId, bid, qty);
    }

    db.prepare("DELETE FROM pets WHERE char_id = ?").run(charId);
    const insPet = db.prepare("INSERT INTO pets (char_id, uid, data) VALUES (?, ?, ?)");
    for (const p of state.pets) {
      insPet.run(charId, p.uid, JSON.stringify(p));
    }
  });
  tx();
}
