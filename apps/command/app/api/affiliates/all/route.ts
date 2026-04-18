import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const meshUrl = process.env.MESH_API_URL || 'http://localhost:8081';
    const email = 'stephen@wnode.one';

    try {
        const res = await fetch(`${meshUrl}/api/v1/acquisition/graph?email=${email}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch from backend');
        
        const data = await res.json();
        const nodes = data.nodes || [];

        // Map backend ReferralNode to Command portal's expectations
        const partners = nodes.map((n: any) => ({
            id: n.id,
            name: n.email.split('@')[0],
            email: n.email,
            status: n.status,
            referrals: n.level === 1 ? 1 : 0, // Simplified mapping
            l1_referrals: n.level === 1 ? 1 : 0,
            l2_referrals: n.level === 2 ? 1 : 0,
            total_revenue: n.revenue,
            total_earned: n.revenue * 0.03, // Provisional split display
            isFounder: n.email.includes('wnode.one')
        }));

        return NextResponse.json(partners);
    } catch (err) {
        console.error("Affiliates API error:", err);
        return NextResponse.json([]);
    }
}
