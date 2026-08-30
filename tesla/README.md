# Tesla

Plugin for Cursor, Grok Bot, and Grok Build: **MCP connector** `tesla` plus skills for vehicle status and confirmed commands.

The MCP is Streamable HTTP. Grok Bot does not accept stdio or localhost. Tesla Fleet / Tessie tokens stay in the **server** environment. This plugin only declares `TESLA_MCP_TOKEN` (HTTP gate).

## Cursor

1. Install **tesla** from the [Cursor Marketplace](https://cursor.com/marketplace), or open this `tesla/` folder as a plugin.
2. Reload if Cursor asks.
3. **Settings → Tools & MCP** → Connect `tesla`.
4. Set `TESLA_MCP_TOKEN` when prompted.
5. Confirm a single server named `tesla`.

## Grok Bot

1. Install the same Cursor Marketplace plugin **tesla**.
2. **Plugins → connect tesla**.
3. Set `TESLA_MCP_TOKEN`.
4. Confirm one `tesla` server.

## Grok Build

```text
/plugin
```

or

```bash
grok plugin install tesla
```

Then connect `tesla`. Skills load from `skills/`. MCP config is `.mcp.json` (identical to `mcp.json`).

## Skills

| Skill | Use when |
| --- | --- |
| `tesla` | Bootstrap, routing, safety |
| `tesla-status` | List, battery, location, charge state — no wake |
| `tesla-command` | Lock / climate / charge / wake after explicit confirmation |

Do not add a second Tesla MCP server.

## Host

Run the Streamable HTTP process from the repo root (stdio still works locally in Cursor via `run.sh`):

```bash
export TESLA_MCP_TOKEN  # HTTP gate; generate a long random secret
export MCP_TRANSPORT=http
npm run start:http
```

Public HTTPS origin must match `mcp.json` / `.mcp.json` (`https://mcp.supervised.nl/mcp`). Point a **Cloudflare Tunnel** at the process (Streamable HTTP). Use ngrok only if you must expose legacy SSE.

## License

MIT. See the repository [LICENSE](../LICENSE).
