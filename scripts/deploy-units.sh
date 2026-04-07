#!/bin/bash
# Deploy Systemd Units for Nodl Ecosystem
# This script copies the service files from the scripts directory to /etc/systemd/system/

set -e

SCRIPTS_DIR="/home/obregan/Documents/nodl/scripts"

deploy_unit() {
  local unit=$1
  echo "Deploying $unit..."
  sudo cp "$SCRIPTS_DIR/$unit" "/etc/systemd/system/$unit"
}

deploy_unit "nodld.service"
deploy_unit "mesh.service"
deploy_unit "command.service"
deploy_unit "nodlr.service"
deploy_unit "web.service"

echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "✅ Systemd unit deployment complete."
