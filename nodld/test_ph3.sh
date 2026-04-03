#!/bin/bash
set -e

# Port
PORT=8088
DIR="/home/obregan/Documents/nodl/nodld"

# 1. Start Backend
API_PORT=$PORT ./nodld > ph3_test_run.log 2>&1 &
BACKEND_PID=$!
sleep 5

# 2. Login & Get JWT
JWT=$(curl -s -X POST http://localhost:$PORT/api/auth/login -H "Content-Type: application/json" -d '{"email":"stephen@nodl.one", "password":"command"}' | grep -oP '(?<="token":")[^"]+')
echo "JWT obtained."

# 3. Get Registration Token
TOKEN_RESP=$(curl -s -X GET http://localhost:$PORT/api/nodes/registration-token -H "Authorization: Bearer $JWT")
REG_TOKEN=$(echo $TOKEN_RESP | grep -oP '(?<="token":")[^"]+')
echo "REG_TOKEN: $REG_TOKEN"

# 4. Run Agent
./nodlr-agent --registration-token="$REG_TOKEN" --api-url="http://localhost:$PORT" > agent_test.log 2>&1 &
AGENT_PID=$!
echo "Agent running..."
sleep 15

# 5. Verify Node List
echo "Listing nodes..."
NODE_LIST=$(curl -s -X GET http://localhost:$PORT/api/nodes -H "Authorization: Bearer $JWT")
echo "Node List Response: $NODE_LIST"

# 6. Check for Node ID in list
if [[ "$NODE_LIST" == *"node_"* ]]; then
    echo "✔ Success: Node found in list."
else
    echo "✖ Failure: Node not found in list."
    cat ph3_test_run.log
    exit 1
fi

# 7. Cleanup
kill $AGENT_PID
kill $BACKEND_PID
echo "Test complete."
