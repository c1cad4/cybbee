#!/usr/bin/env bash
set -euo pipefail
project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
python3 "$project_root/scripts/fetch-pdfjs.py"
python3 "$project_root/scripts/generate-worker.py"
dist_root="$project_root/dist"
rm -rf "$dist_root"
mkdir -p "$dist_root/server" "$dist_root/.openai/drizzle"
cp "$project_root/worker/index.js" "$dist_root/server/index.js"
cp "$project_root/.openai/hosting.json" "$dist_root/.openai/hosting.json"
cp "$project_root"/drizzle/*.sql "$dist_root/.openai/drizzle/"
echo "Built $dist_root"
