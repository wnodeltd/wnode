#!/bin/bash
# scripts/test_pricing_persistence.sh
# Verifies that pricing rules persist in Redis.

API_BASE="http://localhost:8080"
JWT=$(cat ~/.nodl_jwt 2>/dev/null || echo "mock-token")

echo "--- Testing Pricing Persistence ---"
echo "Setting Boost tier to Auto-Tune with 15% undercut..."

curl -s -X POST "$API_BASE/api/admin/pricing/update" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "tier_id": "boost",
    "rate_th_sec": 0.0042,
    "rule": {
      "mode": "auto_tune",
      "targetPercent": 15.0,
      "autoTuneMode": "undercut"
    }
  }' | jq '.rule'

echo -e "\nSimulating Server Restart (In actual env, we'd restart nodld)..."
echo "Checking Redis key: nodl:pricing:tiers"
redis-cli HGET nodl:pricing:tiers boost | jq '.rule'

echo "--- Test Complete ---"
