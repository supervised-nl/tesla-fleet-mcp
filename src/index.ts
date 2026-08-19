import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { vinOrDefault } from "./config.ts";
import { fleet } from "./fleet.ts";
import { endpointsQuery } from "./util.ts";

function text(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

async function run(fn: () => Promise<unknown>) {
  try {
    return text(await fn());
  } catch (e) {
    return { content: [{ type: "text" as const, text: e instanceof Error ? e.message : String(e) }], isError: true };
  }
}

const vinArg = { vin: z.string().optional() };

const server = new McpServer({ name: "tesla-fleet", version: "0.1.0" });

server.tool("vehicles_list", "List vehicles on the signed-in Tesla account.", {}, async () =>
  run(() => fleet("GET", "/api/1/vehicles")),
);

server.tool("vehicle_get", "Cheap vehicle status (state: online/asleep/offline).", vinArg, async ({ vin }) =>
  run(() => fleet("GET", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}`)),
);

server.tool(
  "vehicle_data",
  "Live vehicle_data. Expensive — only when needed. Default is the full payload. Optional endpoints: comma or semicolon list (Tesla wants ; ). Add location_data for GPS.",
  {
    vin: z.string().optional(),
    endpoints: z.string().optional(),
  },
  async ({ vin, endpoints }) =>
    run(() =>
      fleet(
        "GET",
        `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/vehicle_data${endpointsQuery(endpoints)}`,
      ),
    ),
);

server.tool("nearby_chargers", "Charging sites near the vehicle.", vinArg, async ({ vin }) =>
  run(() => fleet("GET", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/nearby_charging_sites`)),
);

server.tool("wake_up", "Wake the vehicle from sleep.", vinArg, async ({ vin }) =>
  run(() => fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/wake_up`)),
);

server.tool("climate_start", "Start cabin preconditioning (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/auto_conditioning_start`, {}, {
      command: true,
    }),
  ),
);

server.tool("climate_stop", "Stop cabin preconditioning (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/auto_conditioning_stop`, {}, {
      command: true,
    }),
  ),
);

server.tool(
  "set_temps",
  "Set cabin temps in °C (needs command proxy).",
  {
    vin: z.string().optional(),
    driver: z.number(),
    passenger: z.number().optional(),
  },
  async ({ vin, driver, passenger }) =>
    run(() =>
      fleet(
        "POST",
        `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/set_temps`,
        { driver_temp: driver, passenger_temp: passenger ?? driver },
        { command: true },
      ),
    ),
);

server.tool("charge_start", "Start charging (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/charge_start`, {}, { command: true }),
  ),
);

server.tool("charge_stop", "Stop charging (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/charge_stop`, {}, { command: true }),
  ),
);

server.tool(
  "set_charge_limit",
  "Set charge limit percent (needs command proxy).",
  { vin: z.string().optional(), percent: z.number() },
  async ({ vin, percent }) =>
    run(() =>
      fleet(
        "POST",
        `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/set_charge_limit`,
        { percent },
        { command: true },
      ),
    ),
);

server.tool("door_lock", "Lock the vehicle (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/door_lock`, {}, { command: true }),
  ),
);

server.tool("door_unlock", "Unlock the vehicle (needs command proxy).", vinArg, async ({ vin }) =>
  run(() =>
    fleet("POST", `/api/1/vehicles/${encodeURIComponent(vinOrDefault(vin))}/command/door_unlock`, {}, { command: true }),
  ),
);

const transport = new StdioServerTransport();
await server.connect(transport);
