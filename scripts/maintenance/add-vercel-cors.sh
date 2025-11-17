#!/bin/bash

##############################################
# 🛡️ Add Vercel domain to Sanity CORS settings
# Usage: ./scripts/maintenance/add-vercel-cors.sh [--token <token>] [--project <projectId>]
##############################################

set -euo pipefail

DOMAIN="https://digiprintplus.vercel.app"
PROJECT_ID="${SANITY_PROJECT_ID:-as5tildt}"
DATASET="${SANITY_DATASET:-production}"
TOKEN="${SANITY_AUTH_TOKEN:-}"

# Get script directory and navigate to studio
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STUDIO_DIR="$PROJECT_ROOT/apps/studio"

cd "$STUDIO_DIR"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token)
      TOKEN="$2"
      shift 2
      ;;
    --project)
      PROJECT_ID="$2"
      shift 2
      ;;
    --dataset)
      DATASET="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

echo "🔐 Using project: $PROJECT_ID ($DATASET dataset)"
echo "🌐 Ensuring CORS entry for $DOMAIN"

echo "⚙️  Running from studio directory: $STUDIO_DIR"
LIST_CMD=(npx -y sanity@latest cors list --project "$PROJECT_ID" --dataset "$DATASET")
if [[ -n "$TOKEN" ]]; then
  LIST_CMD+=(--token "$TOKEN")
fi
"${LIST_CMD[@]}" >/dev/null || true

echo "🧭 Checking existing CORS entries..."
if "${LIST_CMD[@]}" | grep -q "$DOMAIN"; then
  echo "✅ CORS entry already present"
  exit 0
fi

ADD_CMD=(npx -y sanity@latest cors add "$DOMAIN" --credentials --project "$PROJECT_ID")
if [[ -n "$TOKEN" ]]; then
  ADD_CMD+=(--token "$TOKEN")
fi
ADD_CMD+=(--dataset "$DATASET")

echo "➕ Adding $DOMAIN to CORS allow-list..."
"${ADD_CMD[@]}"

echo "✅ Sanity CORS configuration updated"
