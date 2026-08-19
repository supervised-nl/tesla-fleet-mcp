export function qs(params: Record<string, string | number | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : "";
}

/** Tesla Fleet ignores comma-separated `endpoints` (returns metadata only). Use `;`. */
export function endpointsQuery(raw?: string): string {
  if (raw === undefined) return "";
  const parts = raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  return qs({ endpoints: parts.join(";") });
}

export function cap(n: unknown, fallback = 25, max = 50): number {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 1) return fallback;
  return Math.min(Math.floor(v), max);
}
