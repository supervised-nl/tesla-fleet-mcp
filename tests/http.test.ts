import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveHttp } from "../src/http.ts";

const TOKEN = "test-tesla-mcp-token";
const EXPECTED_TOOLS = [
  "vehicles_list",
  "vehicle_get",
  "vehicle_data",
  "nearby_chargers",
  "wake_up",
  "climate_start",
  "climate_stop",
  "set_temps",
  "charge_start",
  "charge_stop",
  "set_charge_limit",
  "door_lock",
  "door_unlock",
];

describe("streamable HTTP", () => {
  let url = "";
  let close: () => Promise<void> = async () => {};

  beforeAll(async () => {
    const server = await serveHttp({ host: "127.0.0.1", port: 0, token: TOKEN });
    url = server.url;
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it("rejects missing bearer", async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
    });
    expect(res.status).toBe(401);
  });

  it("lists tools and runs one read", async () => {
    const transport = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } },
    });
    const client = new Client({ name: "tesla-http-test", version: "0.0.0" });
    await client.connect(transport);
    try {
      const listed = await client.listTools();
      expect(listed.tools.map((t) => t.name)).toEqual(EXPECTED_TOOLS);

      const read = await client.callTool({ name: "vehicles_list", arguments: {} });
      expect(read).toMatchObject({ isError: true });
      const text = (read.content as { type: string; text?: string }[])
        .map((c) => c.text ?? "")
        .join("\n");
      expect(text).toMatch(/Not signed in/i);
    } finally {
      await client.close();
    }
  });
});
