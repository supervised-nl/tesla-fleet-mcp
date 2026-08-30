import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createTeslaServer } from "./server.ts";
import { serveHttp } from "./http.ts";

const http = process.argv.includes("--http") || process.env.MCP_TRANSPORT === "http";

if (http) {
  await serveHttp();
} else {
  const transport = new StdioServerTransport();
  await createTeslaServer().connect(transport);
}
