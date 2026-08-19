export function qs(params: Record<string, string | number | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : "";
}

export function cap(n: unknown, fallback = 25, max = 50): number {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 1) return fallback;
  return Math.min(Math.floor(v), max);
}
