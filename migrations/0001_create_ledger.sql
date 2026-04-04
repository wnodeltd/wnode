-- migrations/0001_create_ledger.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  owner_account_id TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  chain_level INT,
  status TEXT NOT NULL,
  related_payout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  idempotency_key TEXT,
  UNIQUE(payment_intent_id, idempotency_key)
);
