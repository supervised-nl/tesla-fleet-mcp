# Tesla

Works with **Grok Bot**, **Grok Build**, and Cursor. MCP connector `tesla` plus skills for vehicle status and confirmed commands.

Grok Bot needs Streamable HTTP on a public HTTPS URL (no stdio, no localhost). Tesla Fleet / Tessie tokens stay in the **server** environment. This plugin only declares `TESLA_MCP_URL` and `TESLA_MCP_TOKEN`.

## Grok Bot

1. Host the MCP (`MCP_TRANSPORT=http npm run start:http`) with public HTTPS on `/mcp`.
2. **Plugins → connect tesla**.
3. Set `TESLA_MCP_URL` and `TESLA_MCP_TOKEN`.
4. Confirm one server named `tesla`.

Fallback (no marketplace listing):

| Field | Value |
| --- | --- |
| Name | `tesla` |
| Type | `http` |
| URL | your public `https://…/mcp` |
| Header | `Authorization: Bearer <TESLA_MCP_TOKEN>` |

Do not add a second Tesla MCP entry.

## Grok Build

```text
/plugin
```

or

```bash
grok plugin install tesla
```

Manifest: `.grok-plugin/plugin.json`. MCP: `.mcp.json` (identical to `mcp.json`). Then connect `tesla`. Skills load from `skills/`.

## Cursor

1. Install **tesla** from the [Cursor Marketplace](https://cursor.com/marketplace), or open this `tesla/` folder as a plugin.
2. Reload if Cursor asks.
3. **Settings → Tools & MCP** → Connect `tesla`.
4. Set `TESLA_MCP_URL` (public `https://…/mcp`) and `TESLA_MCP_TOKEN` when prompted.
5. Confirm a single server named `tesla`.

## Skills

| Skill | Use when |
| --- | --- |
| `tesla` | Bootstrap, routing, safety |
| `tesla-status` | List, battery, location, charge state — no wake |
| `tesla-command` | Lock / climate / charge / wake after explicit confirmation |

## Host

From the repo root:

```bash
export TESLA_MCP_TOKEN  # HTTP gate; generate a long random secret
export MCP_TRANSPORT=http
npm run start:http
```

Point a public HTTPS origin at `/mcp` (Cloudflare Tunnel for Streamable HTTP). Put that origin in `TESLA_MCP_URL`. Use ngrok only if you must expose legacy SSE.

stdio still works locally in Cursor via `run.sh`.

## License

MIT. See the repository [LICENSE](../LICENSE).
