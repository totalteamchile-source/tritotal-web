import "server-only";

/** Límite simple en memoria por IP (suficiente para frenar envíos repetidos). */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}
