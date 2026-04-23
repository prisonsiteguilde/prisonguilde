// Deterministic PRNG — Mulberry32. Seed-based for reproducible combat/dungeon runs.
// Every combat & dungeon seed is stored server-side to prevent client tampering.

export class RNG {
  private state: number;

  constructor(seed: number) {
    // Normalize seed into a non-zero 32-bit integer.
    this.state = (seed | 0) || 0xdeadbeef;
  }

  next(): number {
    // Mulberry32. Fast, decent quality for game logic. Not cryptographically secure.
    let t = (this.state = (this.state + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error("RNG.pick: empty array");
    return arr[this.int(0, arr.length - 1)]!;
  }

  weighted<T>(entries: readonly { weight: number; value: T }[]): T {
    const total = entries.reduce((s, e) => s + e.weight, 0);
    if (total <= 0) throw new Error("RNG.weighted: total weight is 0");
    let r = this.next() * total;
    for (const e of entries) {
      r -= e.weight;
      if (r <= 0) return e.value;
    }
    return entries[entries.length - 1]!.value;
  }

  shuffle<T>(arr: T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  }

  fork(salt = 0): RNG {
    // Derive an independent stream from current state + salt.
    return new RNG((this.state ^ (salt * 0x9e3779b9)) | 0);
  }
}

export function seedFrom(...parts: (string | number)[]): number {
  // FNV-1a hash into 32-bit seed.
  let h = 0x811c9dc5;
  for (const p of parts) {
    const s = String(p);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
  }
  return h | 0;
}
