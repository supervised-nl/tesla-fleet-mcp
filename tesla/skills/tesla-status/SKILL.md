---
name: tesla-status
description: >-
  Read Tesla vehicle list, cheap online/asleep state, battery, charge state, and location. Use when the user asks how the car is, range, SOC, plugged in, charging, or where the car is. Do not wake the vehicle unless the user asked. Prefer vehicle_get over vehicle_data.
when-to-use: User asks for Tesla status, battery, range, location, or charge state.
---

# Tesla status (reads)

Use the plugin MCP server `tesla`. Read-only. Do not wake the car for these questions.

## Tools (exact names)

1. `vehicles_list` — account vehicles. First call if VIN is unknown. Do not echo VIN in chat; refer to the car by name/model.
2. `vehicle_get` — cheap state (`online` / `asleep` / `offline`). Prefer this. It does not wake the vehicle.
3. `vehicle_data` — live payload. Billable. Only when `vehicle_get` is `online` **and** the user needs battery, charge, climate, or GPS.
   - Battery / charge: `endpoints` = `charge_state`
   - Location: `endpoints` = `location_data`
   - Both: `endpoints` = `charge_state;location_data`
4. `nearby_chargers` — sites near the vehicle.

## Do not

- Call `wake_up` from this skill.
- Poll `vehicle_data`.
- Dump raw VIN, tokens, or GPS beyond what the user asked.
- Run lock, climate, or charge tools here — that is `tesla-command`.

If the car is `asleep` and the user only wanted status, report asleep. Ask before waking.
---
