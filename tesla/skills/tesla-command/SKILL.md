---
name: tesla-command
description: >-
  Tesla write commands: lock/unlock, climate start/stop/set temps, charge start/stop/set limit, and wake. Use when the user asks to lock, precondition, start or stop charging, or wake the car. Call only after explicit user confirmation. Needs the host command proxy.
when-to-use: User asks to lock, unlock, start climate, stop climate, start charging, stop charging, set charge limit, or wake the Tesla.
---

# Tesla commands (writes)

Use the plugin MCP server `tesla`. Every tool here mutates the vehicle. Ask first. Repeat the action in plain language and wait for a clear yes.

## Confirm before calling

- Which car (name/model, not VIN in chat).
- Exact action: lock / unlock / climate on or off / driver temp °C / charge start or stop / charge limit % / wake.

If the user did not confirm, do not call the tool.

## Tools (exact names)

| Tool | Action |
| --- | --- |
| `door_lock` | Lock |
| `door_unlock` | Unlock |
| `climate_start` | Cabin preconditioning on |
| `climate_stop` | Cabin preconditioning off |
| `set_temps` | `driver` °C, optional `passenger` |
| `charge_start` | Start charging |
| `charge_stop` | Stop charging |
| `set_charge_limit` | `percent` |
| `wake_up` | Wake from sleep |

Commands need `TESLA_COMMAND_BASE` (tesla-http-proxy) on the **host**. If the tool errors about a missing command proxy, say so. Do not invent a workaround.

## Do not

- Chain wake + command unless the user asked to wake, or a confirmed command failed because the car is asleep and they then asked to retry.
- Log VIN or tokens.
- Fire a write because a status read was empty.
---
