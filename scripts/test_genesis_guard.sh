#!/bin/bash
# scripts/test_genesis_guard.sh
# Verifies that the backend enforces the 110% operational cost floor.

API_BASE="http://localhost:8080"
JWT=$(cat ~/.nodl_jwt 2>/dev/null || echo "mock-token")

# Operational costs for Standard is 0.0010. 110% is 0.0011.
# We'll try to set it to 0.0005.

echo "--- Testing Genesis Guard Floor ---"
echo "Attempting to set Standard tier rate to $0.0005 (below $0.0011 floor)..."

curl -s -X POST "$API_BASE/api/admin/pricing/update" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "tier_id": "standard",
    "rate_th_sec": 0.0005,
    "rule": {
      "mode": "manual"
    }
  }' | jq .

echo -e "\nVerifying effective rate..."
curl -s "$API_BASE/api/admin/pricing" | jq '.tiers.standard.effectiveRate'

echo "--- Test Complete ---"
