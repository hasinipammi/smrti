import { createFileRoute } from "@tanstack/react-router";
import { isAdmin } from "@/lib/admin-auth.server";
import { IMAGE_BY_KEY } from "@/lib/images";
import {
  MAX_IMAGE_BYTES,
  deleteImage,
  getOverrides,
  saveImage,
  sniffImageType,
} from "@/lib/images.server";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const keyOf = (request: Request) => new URL(request.url).searchParams.get("key") ?? "";

export const Route = createFileRoute("/api/admin/images")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdmin(request))) return json({ error: "Unauthorized" }, 401);
        return json(await getOverrides());
      },
      // Body is the raw image file; ?key= names the image being replaced
      POST: async ({ request }) => {
        if (!(await isAdmin(request))) return json({ error: "Unauthorized" }, 401);
        const key = keyOf(request);
        if (!IMAGE_BY_KEY.has(key)) return json({ error: "Unknown image" }, 400);
        const bytes = new Uint8Array(await request.arrayBuffer());
        if (bytes.length === 0) return json({ error: "Empty file" }, 400);
        if (bytes.length > MAX_IMAGE_BYTES) return json({ error: "Image is larger than 3.5 MB" }, 413);
        const type = sniffImageType(bytes);
        if (!type) return json({ error: "Only PNG, JPG or JPEG images are allowed" }, 415);
        return json({ key, v: await saveImage(key, type, bytes) });
      },
      DELETE: async ({ request }) => {
        if (!(await isAdmin(request))) return json({ error: "Unauthorized" }, 401);
        const key = keyOf(request);
        if (!IMAGE_BY_KEY.has(key)) return json({ error: "Unknown image" }, 400);
        await deleteImage(key);
        return json({ key });
      },
    },
  },
});
