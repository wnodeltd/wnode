import { PoolClient } from 'pg';
import Stripe from 'stripe';

export type LedgerRole = 'platform' | 'l1' | 'l2' | 'founder' | 'nodlrs_pool';
export type LedgerDirection = 'credit' | 'debit';

export interface LedgerEntry {
  userId?: string;
  role: LedgerRole;
  amount: number;
  currency: string;
  direction: LedgerDirection;
  meta?: any;
}

/**
 * Deterministic allocation engine for Stripe payments.
 * 
 * Rules:
 * - 80% -> nodlrs_pool
 * - 5% -> platform
 * - 2% -> l1 (if exists)
 * - 6% -> l2 (if exists)
 * - 3% -> founder (override)
 * 
 * Rounding Strategy:
 * All fees are calculated using integer floor division.
 * The 'nodlrs_pool' (or platform if pool is 0) receives the remainder to ensure zero leakage.
 */
export function calculateAllocations(
  grossAmount: number,
  currency: string,
  metadata: { userId?: string; l1Id?: string; l2Id?: string; founderId?: string }
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let remaining = grossAmount;

  // 1. Platform (5%)
  const platformAmount = Math.floor(grossAmount * 0.05);
  entries.push({
    role: 'platform',
    amount: platformAmount,
    currency,
    direction: 'credit',
    meta: { type: 'fee' }
  });
  remaining -= platformAmount;

  // 2. Level 1 Affiliate (2%)
  if (metadata.l1Id) {
    const l1Amount = Math.floor(grossAmount * 0.02);
    entries.push({
      userId: metadata.l1Id,
      role: 'l1',
      amount: l1Amount,
      currency,
      direction: 'credit'
    });
    remaining -= l1Amount;
  }

  // 3. Level 2 Affiliate (6%)
  if (metadata.l2Id) {
    const l2Amount = Math.floor(grossAmount * 0.06);
    entries.push({
      userId: metadata.l2Id,
      role: 'l2',
      amount: l2Amount,
      currency,
      direction: 'credit'
    });
    remaining -= l2Amount;
  }

  // 4. Founder Override (3%)
  if (metadata.founderId) {
    const founderAmount = Math.floor(grossAmount * 0.03);
    entries.push({
      userId: metadata.founderId,
      role: 'founder',
      amount: founderAmount,
      currency,
      direction: 'credit'
    });
    remaining -= founderAmount;
  }

  // 5. Nodl'rs Pool (Remainder, approx 80-84%)
  // We use the remainder here to ensure total equals gross exactly.
  entries.push({
    role: 'nodlrs_pool',
    amount: remaining,
    currency,
    direction: 'credit',
    userId: metadata.userId // Usually associated with the buyer's account as source
  });

  return entries;
}

/**
 * Atomicly records a Stripe event and its ledger allocations.
 */
export async function allocateLedgerForStripeEvent(
  event: Stripe.Event,
  client: PoolClient
): Promise<void> {
  const stripeEventId = event.id;

  // 1. Idempotency Check & Lock (Implicitly handled by UNIQUE constraint on stripe_event_id, 
  // but we can explicitly check to return early and avoid log noise)
  const existingEvent = await client.query(
    'SELECT status FROM stripe_events WHERE stripe_event_id = $1 FOR UPDATE',
    [stripeEventId]
  );

  if (existingEvent.rows.length > 0) {
    if (existingEvent.rows[0].status === 'processed') {
      console.log(`[Ledger] Event ${stripeEventId} already processed.`);
      return;
    }
    // If pending/failed, we might want to continue or throw depending on strategy.
    // For now, let's assume we proceed if it's not 'processed'.
  } else {
    // Insert initial record
    await client.query(
      'INSERT INTO stripe_events (stripe_event_id, type, raw, status) VALUES ($1, $2, $3, $4)',
      [stripeEventId, event.type, JSON.stringify(event), 'pending']
    );
  }

  // 2. Extract amount and metadata
  let grossAmount = 0;
  let currency = 'usd';
  let metadata: any = {};

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    grossAmount = session.amount_total || 0;
    currency = session.currency || 'usd';
    metadata = session.metadata || {};
  } else if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    grossAmount = invoice.amount_paid;
    currency = invoice.currency || 'usd';
    metadata = invoice.metadata || {};
  } else if (event.type === 'charge.succeeded' || event.type === 'payment_intent.succeeded') {
    const obj = event.data.object as any;
    grossAmount = obj.amount || obj.amount_received || 0;
    currency = obj.currency || 'usd';
    metadata = obj.metadata || {};
  }

  if (grossAmount <= 0) {
    console.warn(`[Ledger] Event ${stripeEventId} has zero or negative amount: ${grossAmount}`);
    await client.query(
      'UPDATE stripe_events SET status = $1 WHERE stripe_event_id = $2',
      ['processed', stripeEventId]
    );
    return;
  }

  // 3. Calculate Allocations
  const allocations = calculateAllocations(grossAmount, currency, {
    userId: metadata.userId,
    l1Id: metadata.l1Id,
    l2Id: metadata.l2Id,
    founderId: metadata.founderId,
  });

  // 4. Write Ledger Rows
  for (const entry of allocations) {
    await client.query(
      `INSERT INTO ledger (stripe_event_id, user_id, role, amount, currency, direction, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        stripeEventId,
        entry.userId || null,
        entry.role,
        entry.amount,
        entry.currency,
        entry.direction,
        JSON.stringify(entry.meta || {})
      ]
    );
  }

  // 5. Mark as Processed
  await client.query(
    'UPDATE stripe_events SET status = $1 WHERE stripe_event_id = $2',
    ['processed', stripeEventId]
  );

  console.log(`[Ledger] Successfully allocated ${grossAmount} ${currency} for event ${stripeEventId}`);
}
