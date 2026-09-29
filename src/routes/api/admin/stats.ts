import { createFileRoute } from "@tanstack/react-router";
import { isAdmin } from "@/lib/admin-auth.server";
import { getStats } from "@/lib/analytics.server";

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdmin(request))) return new Response(null, { status: 401 });
        return new Response(JSON.stringify(await getStats()), {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});
