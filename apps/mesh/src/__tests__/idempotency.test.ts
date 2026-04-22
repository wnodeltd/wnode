import { describe, it, expect, vi } from 'vitest';
import { allocateLedgerForStripeEvent } from '../lib/ledger';

describe('Ledger Engine - Idempotency and Database Interaction', () => {
  it('prevents double-allocation of the same Stripe event', async () => {
    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [] }) // 1st call: check idempotency
        .mockResolvedValueOnce({}) // 2nd call: insert stripe_event
        .mockResolvedValueOnce({}) // 3rd call+: ledger inserts...
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
    } as any;

    const mockEvent = {
      id: 'evt_123',
      type: 'invoice.paid',
      data: {
        object: {
          amount_paid: 1000,
          currency: 'usd',
          metadata: { userId: 'u1' }
        }
      }
    } as any;

    await allocateLedgerForStripeEvent(mockEvent, mockClient);

    // Verify initial query check
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT status FROM stripe_events'),
      ['evt_123']
    );

    // Verify stripe_events insertion
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO stripe_events'),
      expect.arrayContaining(['evt_123', 'invoice.paid'])
    );

    // Verify ledger insertion
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ledger'),
      expect.arrayContaining(['evt_123', 'platform', 50]) // 5% of 1000
    );
  });

  it('skips processing if event is already marked as processed', async () => {
    const mockClient = {
      query: vi.fn().mockResolvedValueOnce({ rows: [{ status: 'processed' }] })
    } as any;

    const mockEvent = { id: 'evt_already_done', type: 'invoice.paid' } as any;

    await allocateLedgerForStripeEvent(mockEvent, mockClient);

    // Should only have called the check query
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.query).not.toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ledger'),
      expect.anything()
    );
  });
});
