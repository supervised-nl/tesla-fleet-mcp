---
name: tesla-status
description: >-
  Read Tesla vehicle list, cheap online/asleep state, battery, charge state, location, alerts, service data, release notes, and energy site status. Use when the user asks how the car is, range, SOC, plugged in, charging, where the car is, or Powerwall/solar live status. Do not wake the vehicle unless the user asked. Prefer vehicle_get over vehicle_data.
when-to-use: User asks for Tesla status, battery, range, location, charge state, alerts, service, or energy site status.
---

# Tesla status (reads)

Use the plugin MCP server `tesla`. Read-only. Do not wake the car for these questions.

## Tools (exact names)

1. `vehicles_list`. Account vehicles. First call if VIN is unknown. Do not echo VIN in chat; refer to the car by name/model.
2. `vehicle_get`. Cheap state (`online` / `asleep` / `offline`). Prefer this. It does not wake the vehicle.
3. `vehicle_data`. Live payload. Billable. Only when `vehicle_get` is `online` **and** the user needs battery, charge, climate, or GPS.
   - Battery / charge: `endpoints` = `charge_state`
   - Location: `endpoints` = `location_data`
   - Both: `endpoints` = `charge_state;location_data`
   - Charge schedules: `endpoints` = `charge_schedule_data`
   - Precondition schedules: `endpoints` = `preconditioning_schedule_data`
4. `nearby_chargers`. Sites near the vehicle.
5. `mobile_enabled`. Mobile access flag.
6. `recent_alerts`. Recent alerts.
7. `service_data`. Service status.
8. `release_notes`. Firmware notes.
9. `energy_products`. Account products (vehicles and energy sites). Needs `energy_device_data` on the host login.
10. `energy_live_status` / `energy_site_info`. `energy_site_id` from `energy_products`.

## Do not

- Call `wake_up` from this skill.
- Poll `vehicle_data`.
- Dump raw VIN, tokens, or GPS beyond what the user asked.
- Run lock, climate, charge, or other write tools here. That is `tesla-command`.

If the car is `asleep` and the user only wanted status, report asleep. Ask before waking.
