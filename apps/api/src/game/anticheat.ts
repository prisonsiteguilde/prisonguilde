import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { AnticheatSignal } from "@corsairs/shared";

export class AnticheatService {
  private readonly requests = new Map<string, number[]>();

  constructor(private readonly hmacSecret: string) {}

  sign(playerId: string, payload: unknown): string {
    return createHmac("sha256", this.hmacSecret).update(playerId).update(JSON.stringify(payload)).digest("hex");
  }

  verify(playerId: string, payload: unknown, signature: string | undefined): boolean {
    if (!signature) return false;
    const expected = this.sign(playerId, payload);
    const left = Buffer.from(expected);
    const right = Buffer.from(signature);
    return left.length === right.length && timingSafeEqual(left, right);
  }

  trackRate(playerId: string, action: string, limit = 10): AnticheatSignal | null {
    const now = Date.now();
    const bucket = (this.requests.get(playerId) ?? []).filter((stamp) => now - stamp < 1000);
    bucket.push(now);
    this.requests.set(playerId, bucket);
    if (bucket.length <= limit) return null;
    return this.signal(playerId, "warning", "rate_limit", `Rate limit exceeded for ${action}`, { action, requests: bucket.length });
  }

  validateTiming(playerId: string, clientTick: number | undefined, serverStartedAt: string): AnticheatSignal | null {
    if (clientTick === undefined) return null;
    const elapsed = Date.now() - new Date(serverStartedAt).getTime();
    if (clientTick > elapsed + 10_000 || clientTick < 0) {
      return this.signal(playerId, "warning", "timing", "Client tick is outside accepted window", { clientTick, elapsed });
    }
    return null;
  }

  signal(playerId: string, severity: AnticheatSignal["severity"], category: AnticheatSignal["category"], message: string, metadata: AnticheatSignal["metadata"]): AnticheatSignal {
    return {
      id: randomUUID(),
      playerId,
      severity,
      category,
      message,
      createdAt: new Date().toISOString(),
      metadata
    };
  }
}
