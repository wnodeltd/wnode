#!/bin/bash
# A lightweight smoke test to assert 200 OK across dashboard metric routes.

COMMAND_HOST="http://127.0.0.1:3001"

echo "Running smoke tests for Command Centre APIs..."

check_endpoint() {
    local route=$1
    local url="${COMMAND_HOST}${route}"
    
    echo -n "Checking ${route}... "
    local status_code=$(curl -sw "%{http_code}" -o /dev/null "$url")

    if [ "$status_code" -eq 200 ]; then
        echo -e "\033[32m[OK 200]\033[0m"
    else
        echo -e "\033[31m[FAILED ${status_code}]\033[0m"
        exit 1
    fi
}

# 1. Assert /api/stats
check_endpoint "/api/stats"

# 2. Assert /api/nodls/all
check_endpoint "/api/nodls/all"

echo -e "\nAll smoke tests completed successfully!"
exit 0
