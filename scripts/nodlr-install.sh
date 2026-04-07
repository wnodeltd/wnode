#!/bin/bash
set -e

# Nodlr Agent Installer for Linux
# Usage: ./nodlr-install.sh --token=<YOUR_TOKEN>

TOKEN=""
API_URL="http://localhost:8080" # Change to production URL later

for i in "$@"; do
  case $i in
    --token=*)
      TOKEN="${i#*=}"
      shift
      ;;
    --api-url=*)
      API_URL="${i#*=}"
      shift
      ;;
    *)
      ;;
  esac
done

if [ -z "$TOKEN" ]; then
  echo "Error: --token is required."
  exit 1
fi

echo "▶ Initializing Nodlr Agent Installation..."

# 1. Create directory
mkdir -p ~/.nodl

# 2. Mock Download (In a real scenario, we'd curl the binary)
# For this dev environment, we assume the binary 'nodlr-agent' is built or available.
# We'll build it now if we are in the repo, or just report success.
if [ -f "./nodld/nodlr-agent" ]; then
    cp ./nodld/nodlr-agent ~/.nodl/nodlr-agent
else
    echo "Notice: Download step skipped in dev environment. Use existing build."
fi

# 3. Register Node
echo "▶ Registering with token..."
~/.nodl/nodlr-agent --registration-token="$TOKEN" --api-url="$API_URL"

# 4. Success
echo "✔ Nodlr Agent installed and registered successfully!"
echo "The agent is now running and reporting heartbeats to $API_URL."
echo "You can check its status in your Nodlr Dashboard."
