import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db, nowMs } from "../db.js";

const DAILY_DONATION_CAP = 5000;
const CREATE_CLAN_COST = 15000;

interface ClanRow {
  id: string;
  name: string;
  tag: string;
  motto: string | null;
  leader_char_id: string;
  treasury_gold: number;
  rank: number;
  xp: number;
  perks: string;
  created_at: number;
}

interface MemberRow {
  clan_id: string;
  char_id: string;
  role: string;
  contribution: number;
  joined_at: number;
  last_donation_at: number | null;
}

export async function registerClanRoutes(app: FastifyInstance): Promise<void> {
  // Require auth
  app.addHook("preHandler", async (req, reply) => {
    if (!req.url.startsWith("/api/clan")) return;
    if (!req.user) reply.code(401).send({ error: "unauthorized" });
  });

  app.get("/api/clan/me", async (req, reply) => {
    const charId = (req.query as { charId?: string }).charId;
    if (!charId) return reply.code(400).send({ error: "missing charId" });
    const member = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(charId) as MemberRow | undefined;
    if (!member) return { clan: null };
    const clan = db.prepare("SELECT * FROM clans WHERE id = ?").get(member.clan_id) as ClanRow | undefined;
    if (!clan) return { clan: null };
    const members = db.prepare("SELECT * FROM clan_members WHERE clan_id = ? ORDER BY contribution DESC").all(clan.id) as MemberRow[];
    return {
      clan: { ...clan, perks: JSON.parse(clan.perks) },
      members,
      role: member.role,
    };
  });

  app.get("/api/clan/list", async () => {
    const clans = db.prepare(`
      SELECT c.id, c.name, c.tag, c.rank, c.xp, c.treasury_gold,
             (SELECT COUNT(*) FROM clan_members m WHERE m.clan_id = c.id) AS member_count
      FROM clans c ORDER BY c.rank DESC, c.xp DESC LIMIT 50
    `).all();
    return { clans };
  });

  const CreateSchema = z.object({
    name: z.string().min(3).max(24),
    tag: z.string().min(2).max(5),
    motto: z.string().max(80).optional(),
    charId: z.string(),
    gold: z.number().int().min(CREATE_CLAN_COST),
  });

  app.post("/api/clan/create", async (req, reply) => {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body", details: parsed.error.flatten() });
    const { name, tag, motto, charId, gold } = parsed.data;
    const existing = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(charId);
    if (existing) return reply.code(409).send({ error: "already in clan" });
    const nameTaken = db.prepare("SELECT id FROM clans WHERE name = ?").get(name);
    if (nameTaken) return reply.code(409).send({ error: "name taken" });
    const id = `clan_${Math.random().toString(36).slice(2, 10)}`;
    db.prepare(`
      INSERT INTO clans (id, name, tag, motto, leader_char_id, treasury_gold, rank, xp, perks, created_at)
      VALUES (?, ?, ?, ?, ?, 0, 1, 0, '[]', ?)
    `).run(id, name, tag.toUpperCase(), motto ?? null, charId, nowMs());
    db.prepare(`
      INSERT INTO clan_members (clan_id, char_id, role, contribution, joined_at) VALUES (?, ?, 'leader', 0, ?)
    `).run(id, charId, nowMs());
    return { ok: true, clanId: id, goldSpent: CREATE_CLAN_COST, refund: gold - CREATE_CLAN_COST };
  });

  const JoinSchema = z.object({ clanId: z.string(), charId: z.string() });
  app.post("/api/clan/join", async (req, reply) => {
    const parsed = JoinSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { clanId, charId } = parsed.data;
    const existing = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(charId);
    if (existing) return reply.code(409).send({ error: "already in clan" });
    const clan = db.prepare("SELECT * FROM clans WHERE id = ?").get(clanId);
    if (!clan) return reply.code(404).send({ error: "no clan" });
    db.prepare(`
      INSERT INTO clan_members (clan_id, char_id, role, contribution, joined_at) VALUES (?, ?, 'recruit', 0, ?)
    `).run(clanId, charId, nowMs());
    return { ok: true };
  });

  const LeaveSchema = z.object({ charId: z.string() });
  app.post("/api/clan/leave", async (req, reply) => {
    const parsed = LeaveSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { charId } = parsed.data;
    const member = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(charId) as MemberRow | undefined;
    if (!member) return reply.code(404).send({ error: "not in clan" });
    if (member.role === "leader") {
      const others = db.prepare("SELECT COUNT(*) as n FROM clan_members WHERE clan_id = ? AND char_id != ?").get(member.clan_id, charId) as { n: number };
      if (others.n > 0) return reply.code(409).send({ error: "transfer leadership first" });
      db.prepare("DELETE FROM clans WHERE id = ?").run(member.clan_id);
    }
    db.prepare("DELETE FROM clan_members WHERE char_id = ?").run(charId);
    return { ok: true };
  });

  const DonateSchema = z.object({ charId: z.string(), amount: z.number().int().positive() });
  app.post("/api/clan/donate", async (req, reply) => {
    const parsed = DonateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { charId, amount } = parsed.data;
    const member = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(charId) as MemberRow | undefined;
    if (!member) return reply.code(404).send({ error: "not in clan" });
    // Daily cap check
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDay = member.last_donation_at ? new Date(member.last_donation_at).setHours(0, 0, 0, 0) : 0;
    const sameDay = today === lastDay;
    const contribToday = sameDay ? member.contribution : 0;
    const capRemaining = DAILY_DONATION_CAP - (sameDay ? contribToday % DAILY_DONATION_CAP : 0);
    const accepted = Math.min(amount, capRemaining);
    if (accepted <= 0) return reply.code(409).send({ error: "daily cap reached", capRemaining: 0 });
    db.prepare("UPDATE clans SET treasury_gold = treasury_gold + ?, xp = xp + ? WHERE id = ?").run(accepted, Math.floor(accepted / 10), member.clan_id);
    db.prepare("UPDATE clan_members SET contribution = contribution + ?, last_donation_at = ? WHERE char_id = ?").run(accepted, nowMs(), charId);
    // rank up on xp thresholds
    const clan = db.prepare("SELECT xp, rank FROM clans WHERE id = ?").get(member.clan_id) as { xp: number; rank: number };
    const newRank = Math.min(10, Math.floor(clan.xp / 5000) + 1);
    if (newRank > clan.rank) {
      db.prepare("UPDATE clans SET rank = ? WHERE id = ?").run(newRank, member.clan_id);
    }
    return { ok: true, accepted, refund: amount - accepted };
  });

  const KickSchema = z.object({ actorCharId: z.string(), targetCharId: z.string() });
  app.post("/api/clan/kick", async (req, reply) => {
    const parsed = KickSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { actorCharId, targetCharId } = parsed.data;
    const actor = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(actorCharId) as MemberRow | undefined;
    if (!actor) return reply.code(404).send({ error: "not in clan" });
    if (!["leader", "officer"].includes(actor.role)) return reply.code(403).send({ error: "not authorized" });
    const target = db.prepare("SELECT * FROM clan_members WHERE char_id = ? AND clan_id = ?").get(targetCharId, actor.clan_id) as MemberRow | undefined;
    if (!target) return reply.code(404).send({ error: "target not in clan" });
    if (target.role === "leader") return reply.code(403).send({ error: "cannot kick leader" });
    db.prepare("DELETE FROM clan_members WHERE char_id = ?").run(targetCharId);
    return { ok: true };
  });

  const PromoteSchema = z.object({ actorCharId: z.string(), targetCharId: z.string(), newRole: z.enum(["recruit", "member", "veteran", "officer"]) });
  app.post("/api/clan/role", async (req, reply) => {
    const parsed = PromoteSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad body" });
    const { actorCharId, targetCharId, newRole } = parsed.data;
    const actor = db.prepare("SELECT * FROM clan_members WHERE char_id = ?").get(actorCharId) as MemberRow | undefined;
    if (!actor || actor.role !== "leader") return reply.code(403).send({ error: "only leader can change roles" });
    db.prepare("UPDATE clan_members SET role = ? WHERE char_id = ? AND clan_id = ?").run(newRole, targetCharId, actor.clan_id);
    return { ok: true };
  });
}
