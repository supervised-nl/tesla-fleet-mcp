# tesla-fleet-mcp

Tesla [Fleet API](https://developer.tesla.com/docs/fleet-api) MCP. TypeScript.

- **stdio** — local Cursor / Hermes (`run.sh`)
- **Streamable HTTP** — Grok Bot, Cursor Cloud, Grok Build plugin in [`tesla/`](tesla/)

Commands (climate, charge, lock) need Tesla’s official [`tesla-http-proxy`](https://github.com/teslamotors/vehicle-command) plus a virtual key on the car. That proxy is **not** bundled here.

Plugin and MCP server name: `tesla`.

## Plugin (Cursor / Grok Bot / Grok Build)

Install and connect **tesla** — do not add a second Tesla MCP entry.

- **Cursor:** Marketplace → tesla, then **Settings → Tools & MCP → Connect** `tesla`
- **Grok Bot:** Plugins → connect `tesla`
- **Grok Build:** `/plugin` or `grok plugin install tesla`

Set plugin variable `TESLA_MCP_TOKEN` (HTTP gate). Tesla Fleet / Tessie tokens stay in server env, never in plugin files.

Details: [`tesla/README.md`](tesla/README.md).

## Tools

| Tool | Notes |
|---|---|
| `vehicles_list` | Account vehicles |
| `vehicle_get` | Cheap state (`online` / `asleep` / `offline`) |
| `vehicle_data` | Live data. Billable. Default = full payload (no `endpoints` filter). Optional `endpoints` list; Tesla wants `;` (commas are accepted by this MCP and rewritten). `location_data` for GPS |
| `nearby_chargers` | Nearby charge sites |
| `wake_up` | Wake from sleep |
| `climate_start` / `climate_stop` / `set_temps` | Needs command proxy |
| `charge_start` / `charge_stop` / `set_charge_limit` | Needs command proxy |
| `door_lock` / `door_unlock` | Needs command proxy |

Do **not** poll `vehicle_data`. Tesla bills per call. Check `vehicle_get` first.

A comma-separated `endpoints` query returns **metadata only** (no `charge_state`). This server rewrites commas to `;`.

## Requirements

- Node 20+
- A Tesla developer application ([dashboard](https://developer.tesla.com/dashboard))
- An HTTPS hostname **you own** (must not contain the word `tesla`)
- Public key at `https://<your-domain>/.well-known/appspecific/com.tesla.3p.public-key.pem`
- Partner `POST /api/1/partner_accounts` in each region you use
- Payment method + billing limit (Fleet API is pay-as-you-go; ~$10/month credit)

## Environment

Copy `env.example` and point `TESLA_CACHE_PATH` at a `0600` file outside git.

| Variable | Required | Meaning |
|---|---|---|
| `TESLA_CLIENT_ID` | yes | Developer app client id |
| `TESLA_CLIENT_SECRET` | yes | Developer app secret |
| `TESLA_REDIRECT_URI` | yes | Must match the app’s allowed redirect (e.g. `https://your.domain/callback`) |
| `TESLA_AUDIENCE` | yes | Fleet base URL for your region (EU example in `env.example`) |
| `TESLA_CACHE_PATH` | no | Token cache path (default: `./token-cache.json`) |
| `TESLA_REGION` | no | `eu` (default) or `na` |
| `TESLA_VIN` | no | Default vehicle if tools omit `vin` |
| `TESLA_COMMAND_BASE` | no | Proxy origin, e.g. `https://127.0.0.1:4443` |
| `NODE_EXTRA_CA_CERTS` | no | Proxy TLS CA if you use a self-signed localhost cert |
| `TESLA_MCP_TOKEN` | HTTP | Bearer gate for Streamable HTTP. **Not** a Fleet/Tessie token |
| `TESLA_MCP_HOST` | HTTP | Bind address (default `0.0.0.0`) |
| `TESLA_MCP_PORT` | HTTP | Bind port (default `8787`) |
| `MCP_TRANSPORT` | HTTP | Set `http` to start Streamable HTTP instead of stdio |

Never commit secrets. Never paste refresh tokens, client secrets, VIN, or `TESLA_MCP_TOKEN` into chat.

## Setup (once)

1. Create the Tesla developer app. Grant type: authorization code **and** machine-to-machine.
2. Allowed origin: `https://your.domain`. Allowed redirect: `https://your.domain/callback`.
3. Scopes you need, typically: `openid`, `offline_access`, `vehicle_device_data`, plus `vehicle_cmds` / `vehicle_charging_cmds` / `vehicle_location` if you use those tools.
4. Generate a P-256 key pair:

```bash
openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
openssl ec -in private-key.pem -pubout -out public-key.pem
```

Host **only** the public key at:

`https://your.domain/.well-known/appspecific/com.tesla.3p.public-key.pem`

5. Register the partner account (EU example):

```bash
# partner token
curl -s --data-urlencode grant_type=client_credentials \
  --data-urlencode client_id="$TESLA_CLIENT_ID" \
  --data-urlencode client_secret="$TESLA_CLIENT_SECRET" \
  --data-urlencode audience="$TESLA_AUDIENCE" \
  --data-urlencode scope='openid vehicle_device_data vehicle_cmds' \
  https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token

# then POST {"domain":"your.domain"} to $TESLA_AUDIENCE/api/1/partner_accounts
# with Authorization: Bearer <partner access_token>
```

6. User login (owner of the car):

```bash
set -a && source .env && set +a
npm install
npm run login
# open the printed URL, approve, paste the full https://your.domain/callback?code=... URL:
npm run login -- "https://your.domain/callback?code=...."
```

The callback host only needs to accept the browser hit; this CLI reads the URL you paste. A blank page is fine.

## Start

stdio (local Cursor / Hermes):

```bash
./run.sh
```

Streamable HTTP (Grok Bot). Public URL in `tesla/mcp.json` must be HTTPS (host or Cloudflare Tunnel — not localhost):

```bash
export TESLA_MCP_TOKEN  # long random secret; same value as the plugin variable
MCP_TRANSPORT=http npm run start:http
# cloudflared tunnel --url http://127.0.0.1:8787
```

Hermes stdio wrapper: `hermes mcp add tesla-fleet --command /path/to/tesla-fleet-mcp/run.sh`

`run.sh` sources `.env` in the repo directory **or** `$TESLA_ENV` if set. Restart the Hermes process/gateway after adding. Enable/disable tools in the client (`tools.include` / `exclude`), not with extra server flags.

## Commands (optional)

Model 3 / Y and recent S/X require the [Vehicle Command Protocol](https://github.com/teslamotors/vehicle-command). Unsigned Fleet command calls are rejected.

1. Run `tesla-http-proxy` with your **private** key, TLS, **localhost only**.
2. Pair the virtual key (Tesla app, car online): `https://tesla.com/_ak/your.domain`
3. Set `TESLA_COMMAND_BASE=https://127.0.0.1:4443` (and `NODE_EXTRA_CA_CERTS` if the proxy cert is self-signed).

Do not publish the proxy to the internet.

## Dev

```bash
npm test
npx tsc --noEmit
```

## License

MIT
