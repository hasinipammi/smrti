// Storage for admin-uploaded images: Upstash Redis (same DB as analytics),
// with an in-memory fallback for local dev.
import { Redis } from "@upstash/redis";
import type { ImageOverrides } from "./images";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
// Raw strings in and out: base64 must never be JSON-parsed by the client
const redis = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;

const META = "smrti:img:meta"; // hash: key -> version
const kData = (key: string) => `smrti:img:data:${key}`; // "<content-type>;<base64>"

const mem = { meta: new Map<string, string>(), data: new Map<string, string>() };

export const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;

/** Returns the real image type from the file's magic bytes, or null. */
export function sniffImageType(b: Uint8Array): "image/png" | "image/jpeg" | null {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  return null;
}

export async function getOverrides(): Promise<ImageOverrides> {
  if (!redis) return Object.fromEntries(mem.meta);
  return ((await redis.hgetall(META)) as ImageOverrides | null) ?? {};
}

export async function saveImage(key: string, type: string, bytes: Uint8Array) {
  const v = Date.now().toString(36);
  const value = `${type};${Buffer.from(bytes).toString("base64")}`;
  if (!redis) {
    mem.data.set(key, value);
    mem.meta.set(key, v);
  } else {
    // data first, so the new version never points at missing bytes
    await redis.set(kData(key), value);
    await redis.hset(META, { [key]: v });
  }
  return v;
}

export async function deleteImage(key: string) {
  if (!redis) {
    mem.meta.delete(key);
    mem.data.delete(key);
    return;
  }
  await redis.hdel(META, key);
  await redis.del(kData(key));
}

export async function loadImage(key: string) {
  const raw = redis ? ((await redis.get(kData(key))) as string | null) : mem.data.get(key);
  if (!raw) return null;
  const i = raw.indexOf(";");
  return { type: raw.slice(0, i), bytes: Buffer.from(raw.slice(i + 1), "base64") };
}
