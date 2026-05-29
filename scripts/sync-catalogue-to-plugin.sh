#!/usr/bin/env bash
# Copy minimal embed assets into the WordPress plugin (no full React catalogue).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/wordpress-plugin/coleebri-health-catalogue/catalogue"
mkdir -p "$DEST/assets" "$DEST/embed"

copy() { install -m 644 "$1" "$DEST/$2" 2>/dev/null || cp "$1" "$DEST/$2"; }

copy "$ROOT/assets/coleebri-embed.js" assets/coleebri-embed.js
[ -f "$ROOT/embed/index.html" ] && copy "$ROOT/embed/index.html" embed/index.html

echo "Synced minimal embed assets to $DEST"
