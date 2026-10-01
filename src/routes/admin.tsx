import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Stats = {
  totalUsers: number;
  daily: { date: string; active: number; visits: number }[];
  languages: { lang: string; count: number }[];
  recent: { id: string; name: string; lang: string; firstSeen: string; lastSeen: string; visits: number }[];
  persistent: boolean;
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Smṛti Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", bn: "Bengali", or: "Odia",
};

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString() : "—");

function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/stats");
    if (r.status === 401) return setAuthed(false);
    setStats(await r.json());
    setAuthed(true);
  }, []);

  useEffect(() => {
    load().catch(() => setAuthed(false));
    const t = setInterval(() => load().catch(() => {}), 30000);
    return () => clearInterval(t);
  }, [load]);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: f.get("username"), password: f.get("password") }),
    });
    if (!r.ok) return setError("Invalid credentials");
    await load();
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setStats(null);
    setAuthed(false);
  };

  if (authed === null) return <Shell><p>Loading…</p></Shell>;

  if (!authed || !stats) {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto mt-24 flex max-w-sm flex-col gap-3 rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Admin sign in</h1>
          <input name="username" placeholder="Username" autoComplete="username" required className="rounded-md border px-3 py-2" />
          <input name="password" type="password" placeholder="Password" autoComplete="current-password" required className="rounded-md border px-3 py-2" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white">Sign in</button>
        </form>
      </Shell>
    );
  }

  const max = Math.max(1, ...stats.daily.map((d) => d.active));

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Smṛti — Usage</h1>
        <div className="flex gap-2">
          <button onClick={() => load()} className="rounded-md border px-3 py-1.5 text-sm">Refresh</button>
          <button onClick={logout} className="rounded-md border px-3 py-1.5 text-sm">Sign out</button>
        </div>
      </div>

      {!stats.persistent && (
        <p className="mt-4 rounded-md bg-amber-100 p-3 text-sm text-amber-900">
          No database configured (KV_REST_API_URL / KV_REST_API_TOKEN) — showing temporary in-memory data.
        </p>
      )}

      <div className="mt-6 w-fit rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm text-neutral-500">Total users</div>
        <div className="mt-1 text-3xl font-semibold">{stats.totalUsers}</div>
      </div>

      <section className="mt-8 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">Daily active users (last 30 days)</h2>
        <div className="flex h-40 items-end gap-1">
          {stats.daily.map((d) => (
            <div key={d.date} title={`${d.date}: ${d.active} users, ${d.visits} sessions`} className="flex-1 rounded-t bg-emerald-500" style={{ height: `${(d.active / max) * 100}%`, minHeight: d.active ? 2 : 0 }} />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>{stats.daily[0].date}</span>
          <span>{stats.daily[stats.daily.length - 1].date}</span>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-medium">Users by language</h2>
          <ul className="space-y-1 text-sm">
            {stats.languages.map((l) => (
              <li key={l.lang} className="flex justify-between">
                <span>{LANG_NAMES[l.lang] ?? l.lang}</span><span>{l.count}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm md:col-span-2">
          <h2 className="mb-3 font-medium">Recent users</h2>
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-500">
              <tr><th className="pb-2">Name</th><th>ID</th><th>Language</th><th>Visits</th><th>First seen</th><th>Last seen</th></tr>
            </thead>
            <tbody>
              {stats.recent.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-1">{u.name || "—"}</td>
                  <td className="font-mono">{u.id.slice(0, 8)}</td>
                  <td>{LANG_NAMES[u.lang] ?? (u.lang || "—")}</td>
                  <td>{u.visits}</td>
                  <td>{fmt(u.firstSeen)}</td>
                  <td>{fmt(u.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-50 p-4 text-neutral-900 md:p-8"><div className="mx-auto max-w-5xl">{children}</div></div>;
}
