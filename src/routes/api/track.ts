import { createFileRoute } from "@tanstack/react-router";
import { recordVisit } from "@/lib/analytics.server";

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const b = (await request.json()) as { id?: string; lang?: string; session?: boolean };
          if (!b.id || !/^[\w-]{8,64}$/.test(b.id)) return new Response(null, { status: 400 });
          const lang = /^[a-z]{2,3}$/.test(b.lang ?? "") ? b.lang! : "";
          await recordVisit(b.id, lang, !!b.session);
          return new Response(null, { status: 204 });
        } catch (e) {
          console.error(e);
          return new Response(null, { status: 204 }); // never break the game over analytics
        }
      },
    },
  },
});
