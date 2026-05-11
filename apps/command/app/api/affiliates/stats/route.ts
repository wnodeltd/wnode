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
            totalPartners: data.l1Count || 0,
            totalReferrals: data.totalReferrals || 0,
            totalRevenue: data.totalRevenue || 0,
            totalEarned: data.totalEarned || 0, 
            conversionRate: (data.conversionRate || 0).toFixed(1),
            monthlyGrowth: data.monthlyGrowth || 0,
            activationVolume: data.activationVolume || 0,
            nextPayoutTotal: data.pendingPayout || 0
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
