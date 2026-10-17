import { createFileRoute } from "@tanstack/react-router";
import { IMAGE_BY_KEY } from "@/lib/images";
import { loadImage } from "@/lib/images.server";

// Serves an uploaded image. URLs carry ?v=<version>, so they can be cached forever.
export const Route = createFileRoute("/api/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = params._splat ?? "";
        const img = IMAGE_BY_KEY.has(key) ? await loadImage(key) : null;
        if (!img) return new Response("Not found", { status: 404 });
        return new Response(new Uint8Array(img.bytes), {
          headers: {
            "content-type": img.type,
            "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        });
      },
    },
  },
});
