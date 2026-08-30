---
name: tesla
description: >-
  Tesla Fleet MCP bootstrap. Use when the user mentions Tesla, the car, Model 3/Y/S/X, Cybertruck, VIN, charging, cabin climate, lock/unlock, or vehicle location. Route status reads to tesla-status and lock/climate/charge writes to tesla-command. Trigger even when the user does not name MCP.
when-to-use: User talks about their Tesla, charging, climate, lock, location, or vehicle status.
---

# Tesla

Connect through this plugin's MCP server `tesla` (Streamable HTTP). Tesla Fleet and Tessie tokens stay on the host. The plugin only has `TESLA_MCP_URL` (public HTTPS `/mcp`) and `TESLA_MCP_TOKEN` (HTTP gate).

## Connect

1. **Settings → Tools & MCP** → connect `tesla`.
2. Set `TESLA_MCP_URL` and `TESLA_MCP_TOKEN` when the plugin asks. The token must match the host `TESLA_MCP_TOKEN`.
3. Confirm a single server named `tesla` is connected.
4. Do not add a second Tesla MCP server.

## Routing

| Need | Skill | Tools |
| --- | --- | --- |
| List, battery, range, location, charge state | `tesla-status` | `vehicles_list`, `vehicle_get`, `vehicle_data`, `nearby_chargers` |
| Lock, climate, charge, wake | `tesla-command` | `door_lock`, `door_unlock`, `climate_start`, `climate_stop`, `set_temps`, `charge_start`, `charge_stop`, `set_charge_limit`, `wake_up` |

## Safety

- Never print VIN, refresh tokens, client secrets, or `TESLA_MCP_TOKEN` in chat.
- Prefer `vehicle_get` before `vehicle_data`. Do not poll `vehicle_data`.
- Do not call `wake_up` for a status question unless the user asked to wake the car.
- Writes (lock/climate/charge/wake) only after explicit user confirmation.
---
