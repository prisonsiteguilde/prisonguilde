import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerAuth } from "./auth.js";
import { registerGameRoutes } from "./routes/game.js";
import { registerDungeonRoutes } from "./routes/dungeon.js";
import { registerCraftRoutes } from "./routes/craft.js";
import { registerShopRoutes } from "./routes/shop.js";
import { db, initDb } from "./db.js";

const PORT = Number(process.env.PORT ?? 3030);
const HOST = process.env.HOST ?? "0.0.0.0";

async function main() {
  initDb();
  const app = Fastify({
    logger: {
      transport: { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } },
    },
  });

  await app.register(cors, { origin: true, credentials: true });
  await registerAuth(app);
  await registerGameRoutes(app);
  await registerDungeonRoutes(app);
  await registerCraftRoutes(app);
  await registerShopRoutes(app);

  app.get("/health", async () => ({ ok: true, db: db ? "up" : "down", ts: Date.now() }));

  await app.listen({ port: PORT, host: HOST });
  app.log.info(`TON Abyss API listening on http://${HOST}:${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
