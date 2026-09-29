import { createFileRoute } from "@tanstack/react-router";
import { checkCredentials, clearCookie, sessionCookie } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = (await request.json().catch(() => ({}))) as {
          username?: string;
          password?: string;
        };
        if (!checkCredentials(String(b.username ?? ""), String(b.password ?? ""))) {
          await new Promise((r) => setTimeout(r, 500)); // slow down brute force
          return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }
        return new Response(null, { status: 204, headers: { "set-cookie": await sessionCookie() } });
      },
      DELETE: async () =>
        new Response(null, { status: 204, headers: { "set-cookie": clearCookie } }),
    },
  },
});
