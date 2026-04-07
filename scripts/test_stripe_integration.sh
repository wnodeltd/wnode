#!/bin/bash
# test_stripe_integration.sh
# Automates the verification of Stripe Connect V2 endpoints in nodld.

API_BASE="http://127.0.0.1:8080/api/v1"

echo "--- Stripe Integration Test Suite ---"

# 1. Health Check
echo -n "Checking API Liveness... "
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/health)
if [ "$HEALTH" -eq 200 ]; then
    echo "OK"
else
    echo "FAILED ($HEALTH). Is nodld running?"
    exit 1
fi

# 2. Create/Link Account
echo -n "Testing Stripe Account Creation & Linking... "
LINK_RESP=$(curl -s -X POST "$API_BASE/stripe/connect/account" \
  -H "Content-Type: application/json" \
  -d '{"email": "stephen@nodl.one"}')

if echo "$LINK_RESP" | grep -q "accountID"; then
    ACCT_ID=$(echo "$LINK_RESP" | grep -oP '"accountID":"\K[^"]+')
    echo "OK (StripeID: $ACCT_ID)"
else
    echo "FAILED"
    echo "$LINK_RESP"
fi

# 3. Generate Onboarding Link
echo -n "Testing Onboarding Link Generation... "
ONBOARD_RESP=$(curl -s -X POST "$API_BASE/stripe/connect/onboard" \
  -H "Content-Type: application/json" \
  -d "{
    \"accountID\": \"$ACCT_ID\", 
    \"returnURL\": \"http://127.0.0.1:3003/onboarding/complete\", 
    \"refreshURL\": \"http://127.0.0.1:3003/onboarding/refresh\"
  }")

if echo "$ONBOARD_RESP" | grep -q "url"; then
    echo "OK"
else
    echo "FAILED"
    echo "$ONBOARD_RESP"
fi

echo "--- Tests Completed ---"
