#!/bin/bash
# ✅ REFINED BUILD SCRIPT
# Builds all Next.js apps with verified ports and environment variables.

set -e

PNPM="/home/obregan/.local/share/pnpm/pnpm"
REPO_ROOT="/home/obregan/Documents/nodl"

build_app() {
  local app_dir=$1
  local port=$2
  echo "Building $app_dir on port $port..."
  cd "$REPO_ROOT/apps/$app_dir"
  export PORT=$port
  export NEXT_PUBLIC_MESH_API_URL="http://localhost:8080"
  
  if [ "$app_dir" == "mesh" ]; then
    export DATABASE_URL="postgres://obregan:SR248054jb%3F%21@localhost:5432/wnode"
    # export STRIPE_SECRET_KEY="..."
    # export STRIPE_WEBHOOK_SECRET="..."
  fi
  
  $PNPM install
  $PNPM build
}

build_app "mesh" 8080
build_app "command" 3004
build_app "nodlr" 3005
build_app "web" 3000

echo "✅ All apps built successfully!"
