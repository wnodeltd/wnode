import { describe, it, expect, vi } from 'vitest';
import { calculateAllocations } from '../lib/ledger';

describe('Ledger Engine - Allocation Logic', () => {
  it('correctly allocates 10000 cents (100 USD)', () => {
    const grossAmount = 10000;
    const currency = 'usd';
    const metadata = {
      userId: 'user_123',
      l1Id: 'l1_456',
      l2Id: 'l2_789',
      founderId: 'founder_001'
    };

    const allocations = calculateAllocations(grossAmount, currency, metadata);

    // Platform: 5% of 10000 = 500
    const platform = allocations.find(a => a.role === 'platform');
    expect(platform?.amount).toBe(500);

    // L1: 2% of 10000 = 200
    const l1 = allocations.find(a => a.role === 'l1');
    expect(l1?.amount).toBe(200);

    // L2: 6% of 10000 = 600
    const l2 = allocations.find(a => a.role === 'l2');
    expect(l2?.amount).toBe(600);

    // Founder: 3% of 10000 = 300
    const founder = allocations.find(a => a.role === 'founder');
    expect(founder?.amount).toBe(300);

    // Nodlrs Pool: Remainder
    // 500 + 200 + 600 + 300 = 1600
    // 10000 - 1600 = 8400
    const pool = allocations.find(a => a.role === 'nodlrs_pool');
    expect(pool?.amount).toBe(8400);

    // Sum verification
    const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(sum).toBe(grossAmount);
  });

  it('handles missing affiliate metadata by pooling remaining funds into nodlrs_pool', () => {
    const grossAmount = 10000;
    const currency = 'usd';
    const metadata = { userId: 'user_123' }; // No L1, L2, or Founder

    const allocations = calculateAllocations(grossAmount, currency, metadata);

    // Platform: 5% of 10000 = 500
    const platform = allocations.find(a => a.role === 'platform');
    expect(platform?.amount).toBe(500);

    // Nodlrs Pool: Remainder
    // 10000 - 500 = 9500
    const pool = allocations.find(a => a.role === 'nodlrs_pool');
    expect(pool?.amount).toBe(9500);

    // Sum verification
    const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(sum).toBe(grossAmount);
  });
});
