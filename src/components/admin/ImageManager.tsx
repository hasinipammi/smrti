import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Loader2, RotateCcw, Search, Upload } from "lucide-react";
import {
  CATEGORIES,
  IMAGES,
  resolveImage,
  type ImageEntry,
  type ImageOverrides,
} from "@/lib/images";

const ACCEPT = ".png,.jpg,.jpeg,image/png,image/jpeg";
const MAX_SIDE = 1600; // larger uploads are scaled down before sending
const MAX_BYTES = 3.5 * 1024 * 1024;

function isAllowed(file: File) {
  return ["image/png", "image/jpeg"].includes(file.type) || /\.(png|jpe?g)$/i.test(file.name);
}

/** Downscales very large images in the browser so uploads stay small. */
async function prepare(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= MAX_BYTES) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const png = file.type === "image/png" || /\.png$/i.test(file.name);
  const out = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, png ? "image/png" : "image/jpeg", 0.9),
  );
  if (!out) throw new Error("Could not read this image");
  return out;
}

export function ImageManager() {
  const [overrides, setOverrides] = useState<ImageOverrides | null>(null);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [onlyCustom, setOnlyCustom] = useState(false);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/images");
    if (!r.ok) throw new Error("Could not load images");
    setOverrides(await r.json());
  }, []);

  useEffect(() => {
    load().catch((e) => setLoadError(e.message));
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: IMAGES.length };
    IMAGES.forEach((e) => (c[e.category] = (c[e.category] ?? 0) + 1));
    return c;
  }, []);

  const visible = IMAGES.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      (!onlyCustom || overrides?.[e.key]) &&
      e.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (loadError) return <p className="mt-6 text-red-600">{loadError}</p>;
  if (!overrides) {
    return (
      <p className="mt-6 flex items-center gap-2 text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading images…
      </p>
    );
  }

  const customCount = Object.keys(overrides).length;

  return (
    <div className="mt-6">
      <p className="text-sm text-neutral-600">
        Replace any picture used in the game. Uploads (PNG, JPG or JPEG) go live for every player
        within a minute. <b>Reset</b> brings back the original. {customCount} replaced so far.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1 text-sm ${
              category === c ? "border-neutral-900 bg-neutral-900 text-white" : "bg-white"
            }`}
          >
            {c} <span className="opacity-60">{counts[c] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="w-48 outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyCustom} onChange={(e) => setOnlyCustom(e.target.checked)} />
          Only replaced images
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-neutral-500">No images match.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((e) => (
            <ImageCard
              key={e.key}
              entry={e}
              overrides={overrides}
              onChange={(v) =>
                setOverrides((o) => {
                  const next = { ...o };
                  if (v) next[e.key] = v;
                  else delete next[e.key];
                  return next;
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageCard({
  entry,
  overrides,
  onChange,
}: {
  entry: ImageEntry;
  overrides: ImageOverrides;
  onChange: (v: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "reset" | null>(null);
  const [error, setError] = useState("");
  const [size, setSize] = useState("");
  const custom = !!overrides[entry.key];

  const upload = async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setError("");
    if (!isAllowed(file)) return setError("Please choose a PNG, JPG or JPEG file");
    setBusy("upload");
    try {
      const body = await prepare(file);
      if (body.size > MAX_BYTES) throw new Error("Image is larger than 3.5 MB");
      const r = await fetch(`/api/admin/images?key=${encodeURIComponent(entry.key)}`, {
        method: "POST",
        headers: { "content-type": body.type || file.type },
        body,
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(res.error ?? "Upload failed");
      onChange(res.v);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    if (!confirm(`Restore the original image for "${entry.label}"?`)) return;
    setError("");
    setBusy("reset");
    try {
      const r = await fetch(`/api/admin/images?key=${encodeURIComponent(entry.key)}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Reset failed");
      onChange(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative grid aspect-[7/5] place-items-center bg-neutral-100">
        <img
          src={resolveImage(entry.url, overrides)}
          alt={entry.label}
          loading="lazy"
          className="h-full w-full object-contain"
          onLoad={(e) => setSize(`${e.currentTarget.naturalWidth}×${e.currentTarget.naturalHeight}`)}
        />
        {custom && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
            Replaced
          </span>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <div className="truncate font-medium" title={entry.label}>{entry.label}</div>
          <div className="text-xs text-neutral-500">
            {entry.category}
            {size && ` · ${size}`}
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="mt-auto flex gap-2">
          <input ref={input} type="file" accept={ACCEPT} className="hidden" onChange={upload} />
          <button
            onClick={() => input.current?.click()}
            disabled={!!busy}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-2 py-1.5 text-sm text-white disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {busy === "upload" ? "Uploading…" : "Replace"}
          </button>
          {custom && (
            <button
              onClick={reset}
              disabled={!!busy}
              title="Restore original"
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
