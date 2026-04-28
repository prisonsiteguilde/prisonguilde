import { createHmac, timingSafeEqual } from "node:crypto";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import websocket from "@fastify/websocket";
import { createPlayerSchema } from "@corsairs/shared";
import Fastify from "fastify";
import { z } from "zod";
import { AnticheatService } from "./game/anticheat.js";
import { GameService } from "./game/services.js";
import { GameStore } from "./game/store.js";
import { demoIdentity, parseTelegramInitData } from "./game/telegram.js";

const port = Number(process.env.PORT ?? 8787);
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:5173";
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const hmacSecret = process.env.SESSION_HMAC_SECRET ?? "dev-secret-change-me";
const tonCollection = process.env.TON_COLLECTION_ADDRESS ?? "ton://collection/corsairs-dev";

const app = Fastify({ logger: true });
const store = new GameStore(new URL("../data/game-db.json", import.meta.url).pathname);
const anticheat = new AnticheatService(hmacSecret);
const game = new GameService(store, anticheat, tonCollection);

await store.load();
await app.register(cors, { origin: [webOrigin, "http://localhost:4173"], credentials: true });
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
await app.register(websocket);

app.get("/health", async () => ({ ok: true, service: "corsairs-api", time: new Date().toISOString() }));

app.post("/api/session", async (request) => {
  const body = z.object({ initData: z.string().optional(), demo: z.boolean().optional() }).parse(request.body ?? {});
  const tg = body.demo ? demoIdentity() : parseTelegramInitData(body.initData, botToken);
  if (!tg) {
    const signal = anticheat.signal("unknown", "critical", "telegram_auth", "Invalid Telegram initData", { hasInitData: Boolean(body.initData) });
    await store.addSignal(signal);
    throw unauthorized("Telegram auth failed");
  }
  const player = await store.getOrCreatePlayer(createPlayerSchema.parse({ ...tg, faction: "brotherhood" }));
  const expiresAt = new Date(Date.now() + 24 * 3600_000).toISOString();
  const token = signToken(player.id, expiresAt);
  return { token, expiresAt, player };
});

app.get("/api/state", async (request) => game.home(await requirePlayerId(request.headers.authorization)));

app.post("/api/battles", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  const body = z.object({ enemyId: z.string(), nonce: z.number().int().nonnegative() }).parse(request.body);
  return game.startBattle(playerId, body.enemyId, body.nonce);
});

app.post("/api/battles/action", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  return game.battleAction(playerId, request.body);
});

app.post("/api/chests/open", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  return game.openChest(playerId, request.body);
});

app.post("/api/craft/start", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  return game.startCraft(playerId, request.body);
});

app.post("/api/craft/:jobId/claim", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  const params = z.object({ jobId: z.string() }).parse(request.params);
  return game.claimCraft(playerId, params.jobId);
});

app.post("/api/market/list", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  return game.listMarket(playerId, request.body);
});

app.post("/api/ton/mint-intent", async (request) => {
  const playerId = await requirePlayerId(request.headers.authorization);
  const body = z.object({ itemUid: z.string(), ownerAddress: z.string().min(8) }).parse(request.body);
  return game.tonMintIntent(playerId, body.itemUid, body.ownerAddress);
});

app.get("/ws", { websocket: true }, (connection) => {
  const timer = setInterval(() => {
    connection.socket.send(JSON.stringify({ type: "heartbeat", time: new Date().toISOString() }));
  }, 15_000);
  connection.socket.on("close", () => clearInterval(timer));
});

await app.listen({ port, host: "0.0.0.0" });

function signToken(playerId: string, expiresAt: string): string {
  const payload = Buffer.from(JSON.stringify({ playerId, expiresAt })).toString("base64url");
  const sig = createHmac("sha256", hmacSecret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

async function requirePlayerId(header: string | undefined): Promise<string> {
  const token = header?.replace(/^Bearer\s+/i, "");
  if (!token) throw unauthorized("Missing session");
  const [payload, sig] = token.split(".");
  if (!payload || !sig) throw unauthorized("Bad session");
  const expected = createHmac("sha256", hmacSecret).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw unauthorized("Bad session signature");
  }
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { playerId: string; expiresAt: string };
  if (Date.now() > new Date(parsed.expiresAt).getTime()) throw unauthorized("Session expired");
  return parsed.playerId;
}

function unauthorized(message: string): Error {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 401;
  return error;
}
