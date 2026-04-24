import type { FastifyInstance } from "fastify";
import { createHmac } from "node:crypto";
import { db, nowMs } from "./db.js";

// Telegram Mini App auth. Verifies initData using bot token as shared secret.
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
const BOT_TOKEN = process.env.TG_BOT_TOKEN ?? "";

export interface SessionUser {
  id: string;
  tgId: number;
  username?: string | undefined;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: SessionUser;
  }
}

export function verifyInitData(initData: string): { ok: boolean; user?: { id: number; username?: string } } {
  if (!BOT_TOKEN) {
    // Dev fallback: accept unsigned initData. Never enable in prod.
    if (process.env.NODE_ENV !== "production") {
      const params = new URLSearchParams(initData);
      const userRaw = params.get("user");
      if (!userRaw) return { ok: false };
      try {
        const parsed = JSON.parse(userRaw);
        return { ok: true, user: { id: parsed.id, username: parsed.username } };
      } catch {
        return { ok: false };
      }
    }
    return { ok: false };
  }
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const sig = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  if (sig !== hash) return { ok: false };
  const userRaw = params.get("user");
  if (!userRaw) return { ok: false };
  try {
    const parsed = JSON.parse(userRaw);
    return { ok: true, user: { id: parsed.id, username: parsed.username } };
  } catch {
    return { ok: false };
  }
}

export async function registerAuth(app: FastifyInstance): Promise<void> {
  app.post("/api/auth/telegram", async (req, reply) => {
    const body = req.body as { initData?: string };
    if (!body?.initData) return reply.code(400).send({ error: "missing initData" });
    const result = verifyInitData(body.initData);
    if (!result.ok || !result.user) return reply.code(401).send({ error: "bad signature" });
    const tgId = result.user.id;
    let row = db.prepare("SELECT * FROM users WHERE tg_id = ?").get(tgId) as any;
    if (!row) {
      const id = `u_${tgId}`;
      db.prepare("INSERT INTO users (id, tg_id, username, created_at) VALUES (?, ?, ?, ?)").run(
        id,
        tgId,
        result.user.username ?? null,
        nowMs(),
      );
      row = { id, tg_id: tgId, username: result.user.username };
    }
    // In a real deploy we'd return a signed JWT; for MVP we return the id.
    return { token: row.id, user: { id: row.id, username: row.username } };
  });

  // Simple bearer-token middleware: token == user id.
  app.addHook("preHandler", async (req) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return;
    const token = auth.slice(7);
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(token) as any;
    if (row) req.user = { id: row.id, tgId: row.tg_id, username: row.username ?? undefined };
  });
}
