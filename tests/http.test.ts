import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveHttp } from "../src/http.ts";
import { TESLA_TOOL_NAMES, TESLA_TOOLS } from "../src/tools.ts";

const TOKEN = "test-tesla-mcp-token";

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
      expect(listed.tools.map((t) => t.name)).toEqual(TESLA_TOOL_NAMES);
      const byName = new Map(listed.tools.map((t) => [t.name, t.description ?? ""]));
      for (const meta of TESLA_TOOLS) {
        const description = byName.get(meta.name) ?? "";
        if (meta.needsProxy) expect(description).toMatch(/command proxy/i);
        else expect(description).not.toMatch(/command proxy/i);
        if ("danger" in meta && meta.danger === "extra-confirm") {
          expect(description).toMatch(/Extra confirm/i);
        }
      }

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
