#!/bin/bash

# Fedora Network Compatibility: Force 127.0.0.1
export HOST=127.0.0.1

echo "🚀 Starting Nodl Local Stack..."

# Start nodld (Go Backend)
(cd nodld && go run cmd/nodld/main.go) &
BACKEND_PID=$!

# Start Apps
(cd apps/nodlr && npm run dev) &
NODLR_PID=$!

(cd apps/mesh && npm run dev) &
MESH_PID=$!

(cd apps/command && npm run dev) &
COMMAND_PID=$!

(cd apps/web && npm run dev) &
WEB_PID=$!


echo "✅ All systems initiated."
echo "-----------------------------------"
echo "Command: http://127.0.0.1:3001"
echo "Nodlr:   http://127.0.0.1:3002"
echo "Mesh:    http://127.0.0.1:3003"
echo "Web:     http://127.0.0.1:3000"
echo "Backend: http://127.0.0.1:8080"
echo "-----------------------------------"

# Handle shutdown
trap "kill $BACKEND_PID $NODLR_PID $MESH_PID $COMMAND_PID $WEB_PID; exit" SIGINT SIGTERM

wait
