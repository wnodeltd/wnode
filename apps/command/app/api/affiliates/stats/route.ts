import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const meshUrl = process.env.MESH_API_URL || 'http://localhost:8081';
    const email = 'stephen@wnode.one';

    try {
        const res = await fetch(`${meshUrl}/api/v1/acquisition/overview?email=${email}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch stats from backend');
        
        const data = await res.json();

        return NextResponse.json({
            totalPartners: data.l1Count,
            totalReferrals: data.totalReferrals,
            totalRevenue: data.totalRevenue,
            totalEarned: data.totalRevenue * 0.03, // Provisional
            conversionRate: data.conversionRate.toFixed(1),
            nextPayoutTotal: (data.totalRevenue * 0.03) * 0.2 // Mock pending component for now
        });
    } catch (err) {
        console.error("Affiliate Stats API error:", err);
        return NextResponse.json({
            totalPartners: 0,
            totalReferrals: 0,
            totalRevenue: 0,
            totalEarned: 0,
            conversionRate: "0.0",
            nextPayoutTotal: 0
        });
    }
}
