#!/usr/bin/env bash
# Build wordpress-plugin/coleebri-catalogue.zip for upload to WordPress.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/wordpress-plugin"
rm -f coleebri-catalogue.zip
zip -r coleebri-catalogue.zip coleebri-catalogue -x "*.DS_Store"
ls -lh coleebri-catalogue.zip
echo "Install: Plugins → Add New → Upload → coleebri-catalogue.zip"
