import { acquireToken } from "./auth.ts";
import { commandBase, fleetBase } from "./config.ts";

export type FleetJson = Record<string, unknown>;

export async function fleet(
  method: string,
  path: string,
  body?: unknown,
  opts: { command?: boolean } = {},
): Promise<unknown> {
  const token = await acquireToken();
  const base = opts.command ? commandBase() : fleetBase();
  if (opts.command && !base) {
    throw new Error("Missing TESLA_COMMAND_BASE (tesla-http-proxy). Commands are unsigned without it.");
  }
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return { ok: true };
  const text = await res.text();
  const json = text ? (JSON.parse(text) as FleetJson) : {};
  if (!res.ok) {
    const err = json.error as string | FleetJson | undefined;
    const msg = typeof err === "string" ? err : err?.message ?? text;
    throw new Error(`Tesla ${res.status} ${method} ${path}: ${msg}`.trim());
  }
  return json;
}
