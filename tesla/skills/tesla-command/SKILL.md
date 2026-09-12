---
name: tesla-command
description: >-
  Tesla write commands: lock/unlock, climate, charge, honk/flash, trunk, windows, sentry, media, navigation, software update, schedules, valet, speed limit, guest mode, remote start, PIN clears, erase, and wake. Use when the user asks to change the car. Call only after explicit user confirmation. Extra confirm for unlock, remote start, PIN clears, erase, valet, speed limit, and guest mode. Needs the host command proxy.
when-to-use: User asks to lock, unlock, start climate, charge, honk, open trunk, sentry, media, navigate, update software, valet, guest mode, or wake the Tesla.
---

# Tesla commands (writes)

Use the plugin MCP server `tesla`. Every tool here mutates the vehicle. Ask first. Repeat the action in plain language and wait for a clear yes.

## Confirm before calling

- Which car (name/model, not VIN in chat).
- Exact action in plain language.

If the user did not confirm, do not call the tool.

## Extra confirm (danger)

Ask a second time, name the irreversible bit, and wait for another clear yes before these tools:

| Tool | Why |
| --- | --- |
| `door_unlock` | Unlocks the car |
| `remote_start_drive` | Remote start / keyless drive |
| `erase_user_data` | Wipes UI user data (parked Guest Mode) |
| `clear_pin_to_drive_admin` | Clears PIN to Drive (owner / fleet) |
| `reset_pin_to_drive_pin` | Removes PIN to Drive |
| `speed_limit_clear_pin` | Clears speed-limit PIN |
| `speed_limit_clear_pin_admin` | Admin speed-limit PIN clear |
| `reset_valet_pin` | Clears valet PIN |
| `set_valet_mode` | Valet on/off (PIN when enabling) |
| `guest_mode` | Guest Mode on/off |
| `speed_limit_activate` | Speed Limit Mode on (PIN) |
| `speed_limit_deactivate` | Speed Limit Mode off |
| `speed_limit_set_limit` | Speed cap (mph) |

Do not log PINs or passwords.

## Tools (exact names)

| Tool | Action |
| --- | --- |
| `door_lock` | Lock |
| `door_unlock` | Unlock (extra confirm) |
| `climate_start` | Cabin preconditioning on |
| `climate_stop` | Cabin preconditioning off |
| `set_temps` | `driver` °C, optional `passenger` |
| `set_climate_keeper_mode` | `climate_keeper_mode` 0–3 |
| `charge_start` | Start charging |
| `charge_stop` | Stop charging |
| `set_charge_limit` | `percent` |
| `set_charging_amps` | `charging_amps` |
| `charge_port_door_open` / `charge_port_door_close` | Charge port |
| `honk_horn` / `flash_lights` | Locate (park) |
| `actuate_trunk` | `which_trunk` `front` or `rear` |
| `window_control` | `command` `vent` or `close`; `lat`/`lon` for close |
| `remote_start_drive` | Remote start (extra confirm) |
| `set_sentry_mode` | `on` boolean |
| `media_toggle_playback` / `media_next_track` / `media_prev_track` | Media |
| `media_volume_up` / `media_volume_down` / `adjust_volume` | Volume |
| `navigation_request` | Share-to-car `text` |
| `navigation_gps_request` | `lat` / `lon` |
| `schedule_software_update` | `offset_sec` |
| `cancel_software_update` | Cancel OTA countdown |
| `add_charge_schedule` / `remove_charge_schedule` | Charge schedule |
| `add_precondition_schedule` / `remove_precondition_schedule` | Precondition schedule |
| `wake_up` | Wake from sleep |

Commands need `TESLA_COMMAND_BASE` (tesla-http-proxy) on the **host**, except `wake_up`. If the tool errors about a missing command proxy, say so. Do not invent a workaround.

## Do not

- Chain wake + command unless the user asked to wake, or a confirmed command failed because the car is asleep and they then asked to retry.
- Log VIN, tokens, or PINs.
- Fire a write because a status read was empty.
- Skip extra confirm on the danger list.
