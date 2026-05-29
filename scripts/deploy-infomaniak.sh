#!/usr/bin/env bash
# Upload catalogue static files to Infomaniak (same host as WordPress).
# Usage:
#   export COLEEBRI_DEPLOY_HOST=user@ssh.infomaniak.com
#   export COLEEBRI_DEPLOY_PATH=/home/user/sites/health.coleebri.com/public_html/catalogue
#   ./scripts/deploy-infomaniak.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${COLEEBRI_DEPLOY_HOST:?Set COLEEBRI_DEPLOY_HOST (e.g. user@host)}"
DEST="${COLEEBRI_DEPLOY_PATH:?Set COLEEBRI_DEPLOY_PATH (remote catalogue directory)}"

echo "Deploying $ROOT -> $HOST:$DEST"
rsync -avz --delete \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'export/' \
  --exclude 'wordpress-plugin/' \
  --exclude 'node_modules/' \
  --exclude '.cursor/' \
  "$ROOT/" "$HOST:$DEST/"

echo "Done. Verify:"
echo "  https://health.coleebri.com/catalogue/Coleebri%20Patient%20Catalogue.html"
echo "  https://health.coleebri.com/catalogue/embed/?widget=most-ordered"
