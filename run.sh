#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
set -a
if [[ -n "${TESLA_ENV:-}" && -f "$TESLA_ENV" ]]; then
  # shellcheck disable=SC1090
  source "$TESLA_ENV"
elif [[ -f .env ]]; then
  # shellcheck disable=SC1091
  source .env
fi
set +a
exec ./node_modules/.bin/tsx src/index.ts
