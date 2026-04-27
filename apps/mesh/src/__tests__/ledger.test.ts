import { describe, it, expect, vi } from 'vitest';
import { calculateAllocations } from '../lib/ledger';

describe('Ledger Engine - Wnode Economic Constitution (10/70/3/7/7/3)', () => {
  it('correctly allocates 10000 cents (100 USD) with all tiers present', () => {
    const grossAmount = 10000;
    const currency = 'usd';
    const metadata = {
      userId: 'user_123',
      l1Id: 'l1_456',
      l2Id: 'l2_789',
      founderId: 'founder_001',
      salesSourceId: 'sales_007'
    };

    const allocations = calculateAllocations(grossAmount, currency, metadata);

    // Sales Source: 10% of 10000 = 1000
    const sales = allocations.find(a => a.role === 'sales_source');
    expect(sales?.amount).toBe(1000);

    // Management: 7% of 10000 = 700
    const management = allocations.find(a => a.role === 'management');
    expect(management?.amount).toBe(700);

    // L1: 3% of 10000 = 300
    const l1 = allocations.find(a => a.role === 'l1');
    expect(l1?.amount).toBe(300);

    // L2: 7% of 10000 = 700
    const l2 = allocations.find(a => a.role === 'l2');
    expect(l2?.amount).toBe(700);

    // Founder: 3% of 10000 = 300
    const founder = allocations.find(a => a.role === 'founder');
    expect(founder?.amount).toBe(300);

    // Nodlrs Pool: Remainder (70% nominal)
    // 1000 + 700 + 300 + 700 + 300 = 3000
    // 10000 - 3000 = 7000
    const pool = allocations.find(a => a.role === 'nodlrs_pool');
    expect(pool?.amount).toBe(7000);

    // Sum verification
    const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(sum).toBe(grossAmount);
  });

  it('handles missing affiliate metadata by pooling remaining funds into nodlrs_pool', () => {
    const grossAmount = 10000;
    const currency = 'usd';
    const metadata = { userId: 'user_123' }; // No L1, L2, Founder, or SalesSource

    const allocations = calculateAllocations(grossAmount, currency, metadata);

    // Sales Source: 10% of 10000 = 1000 (Always allocated, even if userId is missing)
    const sales = allocations.find(a => a.role === 'sales_source');
    expect(sales?.amount).toBe(1000);

    // Management: 7% of 10000 = 700
    const management = allocations.find(a => a.role === 'management');
    expect(management?.amount).toBe(700);

    // Nodlrs Pool: Remainder
    // 10000 - 1000 - 700 = 8300
    const pool = allocations.find(a => a.role === 'nodlrs_pool');
    expect(pool?.amount).toBe(8300);

    // Sum verification
    const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(sum).toBe(grossAmount);
  });
});
