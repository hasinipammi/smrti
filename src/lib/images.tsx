// Catalog of every image the game uses, plus admin-uploaded replacements.
// Uploads are stored server-side (see images.server.ts) and swapped in at
// render time via <Img>, keyed by the original asset URL.
import { createContext, useContext, type ComponentProps } from "react";

export type ImageEntry = { key: string; url: string; label: string; category: string };
/** key -> version (upload timestamp); present only for replaced images */
export type ImageOverrides = Record<string, string>;

const manifests = import.meta.glob<{ url: string; content_type?: string }>(
  "../assets/**/*.asset.json",
  { eager: true, import: "default" },
);

// Superseded by /logo.png, no longer shown anywhere
const UNUSED = new Set(["smrti-symbol-v6.png"]);

export const CATEGORIES = [
  "App icons",
  "Fruits",
  "Vegetables",
  "Dishes",
  "Dish plates (quiz)",
  "Scenes (quiz)",
  "Festivals",
  "Regional festivals",
] as const;

const titleCase = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

function describe(key: string): Pick<ImageEntry, "label" | "category"> {
  const [dir, file] = key.includes("/") ? key.split("/") : ["", key];
  const name = file.replace(/\.(png|jpe?g)$/, "");
  if (dir === "ds2") {
    const veg = name.startsWith("veg-");
    return { label: titleCase(name.replace(/^(fruit|veg)-/, "")), category: veg ? "Vegetables" : "Fruits" };
  }
  if (dir === "fest3") {
    const [lang, ...rest] = name.split("-");
    return { label: `${titleCase(rest.join("-"))} (${titleCase(lang)})`, category: "Regional festivals" };
  }
  if (dir === "mcq2") {
    if (name.startsWith("dish-")) return { label: titleCase(name.slice(5)), category: "Dishes" };
    if (name.startsWith("fest-")) return { label: titleCase(name.slice(5)), category: "Festivals" };
    if (name.startsWith("combo-")) return { label: `Plate ${name.slice(6)}`, category: "Dish plates (quiz)" };
    if (name.startsWith("scene-")) return { label: `Scene ${name.slice(6)}`, category: "Scenes (quiz)" };
  }
  return { label: titleCase(name), category: "App icons" };
}

export const IMAGES: ImageEntry[] = [
  { key: "app/logo.png", url: "/logo.png", label: "Logo", category: "App icons" },
];
for (const [path, m] of Object.entries(manifests)) {
  const key = path.replace("../assets/", "").replace(".asset.json", "");
  if (!/\.(png|jpe?g)$/.test(key) || UNUSED.has(key)) continue;
  IMAGES.push({ key, url: m.url, ...describe(key) });
}
IMAGES.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

export const IMAGE_BY_KEY = new Map(IMAGES.map((e) => [e.key, e]));
const KEY_BY_URL = new Map(IMAGES.map((e) => [e.url, e.key]));

export const overrideUrl = (key: string, v: string) => `/api/img/${key}?v=${v}`;

export function resolveImage(url: string | undefined, overrides: ImageOverrides) {
  if (!url) return url;
  const key = KEY_BY_URL.get(url);
  const v = key && overrides[key];
  return v ? overrideUrl(key, v) : url;
}

export const ImageOverridesContext = createContext<ImageOverrides>({});

/** Drop-in <img> that shows the admin-uploaded replacement when one exists. */
export function Img({ src, ...props }: ComponentProps<"img">) {
  const overrides = useContext(ImageOverridesContext);
  return <img src={resolveImage(src, overrides)} {...props} />;
}
