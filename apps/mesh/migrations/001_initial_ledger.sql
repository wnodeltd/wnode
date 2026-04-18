-- Migration: 001_initial_ledger.sql
-- Create stripe_events and ledger tables for idempotent, atomic ledger allocation.

-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE ledger_role AS ENUM ('platform', 'l1', 'l2', 'founder', 'nodlrs_pool');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ledger_direction AS ENUM ('credit', 'debit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Idempotency table for caching processed Stripe events
CREATE TABLE IF NOT EXISTS stripe_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    raw JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'failed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Flat ledger table for all financial allocations
CREATE TABLE IF NOT EXISTS ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT NOT NULL REFERENCES stripe_events(stripe_event_id),
    user_id TEXT, -- Nullable if not associated with a specific user (e.g. system pool)
    role ledger_role NOT NULL,
    amount BIGINT NOT NULL, -- In smallest currency unit (e.g. cents)
    currency TEXT NOT NULL DEFAULT 'usd',
    direction ledger_direction NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by stripe_event_id
CREATE INDEX IF NOT EXISTS idx_ledger_stripe_event_id ON ledger(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON ledger(user_id);
