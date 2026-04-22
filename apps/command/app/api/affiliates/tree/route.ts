import { NextResponse } from 'next/server';

export async function GET() {
    const meshUrl = process.env.MESH_API_URL || 'http://localhost:8081';

    try {
        const res = await fetch(`${meshUrl}/api/v1/acquisition/tree`, {
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch tree from backend');
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Affiliates Tree API error:", err);
        return NextResponse.json({
            summary: { totalAffiliates: 0, activeAffiliates: 0, totalNodes: 0, growth30d: 0 },
            founders: []
        });
    }
}
