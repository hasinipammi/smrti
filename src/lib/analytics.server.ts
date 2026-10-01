// Usage tracking store. Uses Upstash Redis (Vercel Marketplace → "Upstash Redis"),
// which is HTTP-based and works in serverless. Falls back to in-memory for local dev.
import { Redis } from "@upstash/redis";

export type UserRecord = {
  id: string;
  name: string;
  lang: string;
  firstSeen: string;
  lastSeen: string;
  visits: number;
};

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// ---- local-dev fallback (not persistent, single process) ----
const mem = {
  users: new Map<string, UserRecord>(),
  daily: new Map<string, Set<string>>(),
  visits: new Map<string, number>(),
};

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const K_USERS = "smrti:users";
const kUser = (id: string) => `smrti:user:${id}`;
const kDaily = (d: string) => `smrti:dau:${d}`;
const kVisits = (d: string) => `smrti:visits:${d}`;

export async function recordVisit(id: string, lang: string, name: string, newSession: boolean) {
  const now = new Date().toISOString();
  const today = day();
  if (!redis) {
    const u = mem.users.get(id);
    mem.users.set(id, {
      id,
      name: name || u?.name || "",
      lang: lang || u?.lang || "",
      firstSeen: u?.firstSeen ?? now,
      lastSeen: now,
      visits: (u?.visits ?? 0) + (newSession ? 1 : 0),
    });
    if (!mem.daily.has(today)) mem.daily.set(today, new Set());
    mem.daily.get(today)!.add(id);
    if (newSession) mem.visits.set(today, (mem.visits.get(today) ?? 0) + 1);
    return;
  }
  const p = redis.pipeline();
  p.sadd(K_USERS, id);
  p.sadd(kDaily(today), id);
  p.hsetnx(kUser(id), "firstSeen", now);
  p.hset(kUser(id), { lastSeen: now, ...(lang ? { lang } : {}), ...(name ? { name } : {}) });
  if (newSession) {
    p.hincrby(kUser(id), "visits", 1);
    p.incr(kVisits(today));
  }
  await p.exec();
}

export type Stats = {
  totalUsers: number;
  daily: { date: string; active: number; visits: number }[];
  languages: { lang: string; count: number }[];
  recent: UserRecord[];
  persistent: boolean;
};

export async function getStats(days = 30): Promise<Stats> {
  const dates = Array.from({ length: days }, (_, i) =>
    day(new Date(Date.now() - (days - 1 - i) * 864e5)),
  );
  let users: UserRecord[];
  let daily: { date: string; ids: string[]; visits: number }[];

  if (!redis) {
    users = [...mem.users.values()];
    daily = dates.map((date) => ({
      date,
      ids: [...(mem.daily.get(date) ?? [])],
      visits: mem.visits.get(date) ?? 0,
    }));
  } else {
    const ids = (await redis.smembers(K_USERS)) as string[];
    const up = redis.pipeline();
    ids.forEach((id) => up.hgetall(kUser(id)));
    const dp = redis.pipeline();
    dates.forEach((d) => {
      dp.smembers(kDaily(d));
      dp.get(kVisits(d));
    });
    const [ur, dr] = await Promise.all([ids.length ? up.exec() : Promise.resolve([]), dp.exec()]);
    users = (ur as Record<string, unknown>[]).map((h, i) => ({
      id: ids[i],
      name: String(h?.name ?? ""),
      lang: String(h?.lang ?? ""),
      firstSeen: String(h?.firstSeen ?? ""),
      lastSeen: String(h?.lastSeen ?? ""),
      visits: Number(h?.visits ?? 0),
    }));
    daily = dates.map((date, i) => ({
      date,
      ids: (dr[i * 2] as string[]) ?? [],
      visits: Number(dr[i * 2 + 1] ?? 0),
    }));
  }

  const langCount = new Map<string, number>();
  users.forEach((u) => {
    const k = u.lang || "unknown";
    langCount.set(k, (langCount.get(k) ?? 0) + 1);
  });

  return {
    totalUsers: users.length,
    daily: daily.map((d) => ({ date: d.date, active: d.ids.length, visits: d.visits })),
    languages: [...langCount]
      .map(([lang, count]) => ({ lang, count }))
      .sort((a, b) => b.count - a.count),
    recent: users.sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, 50),
    persistent: !!redis,
  };
}
