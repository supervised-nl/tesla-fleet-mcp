# Agents

Use `/poteto-mode` for implementation, investigation, and review in this repo.

## Verify

```bash
npm test
npx tsc --noEmit
```

`npm test` is the repo check. It must stay green with `tsc --noEmit`. `EXPECTED_TOOLS` lives in `src/tools.ts` as `TESLA_TOOL_NAMES` and must match `listTools()` on the live server.

## Safety

Never commit `.env`, token caches, PEMs, VINs, Fleet tokens, refresh tokens, client secrets, or `TESLA_MCP_TOKEN`. The `tesla/` plugin may only declare `TESLA_MCP_URL` and `TESLA_MCP_TOKEN`. Do not bundle `tesla-http-proxy`. Do not invent Fleet endpoints.
