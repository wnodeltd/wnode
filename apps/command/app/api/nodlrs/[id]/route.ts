import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';

    if (isSimulated) {
        const nodlr = simulationState.nodlrs.find((n: any) => n.id === id || n.protocolId === id);
        if (!nodlr) return NextResponse.json({ error: 'Nodl\'r not found' }, { status: 404 });
        
        // Return flattened hybrid object as expected by the provider inspector
        return NextResponse.json({
            ...nodlr,
            integrityScore: 950,
            payoutFrequency: 'Weekly',
            accruedFounderBalance: nodlr.accruedFounderBalance || 0,
            role: nodlr.role || 'provider',
            fleetSummary: simulationState.nodls.filter((n: any) => n.userID === nodlr.id),
            affiliateTree: simulationState.affiliateReferrals.filter((r: any) => r.partnerId === nodlr.id),
            stripeVerification: nodlr.stripeVerification ? 'verified' : 'pending'
        });
    }

    const apiUrl = process.env.NODLD_API_URL || 'https://api.nodl.one';

    try {
        // 1. Fetch Account Profile (full account object)
        const profileRes = await fetch(`${apiUrl}/account/${id}`, { cache: 'no-store' });
        
        if (!profileRes.ok) {
            return NextResponse.json(
                { error: `Backend account lookup failed for ${id}`, status: profileRes.status },
                { status: profileRes.status }
            );
        }

        // 2. Initial concurrency for secondary data
        const [nodesRes, affiliatesRes] = await Promise.all([
            fetch(`${apiUrl}/api/nodes/all`, { cache: 'no-store' }),
            fetch(`${apiUrl}/affiliates/tree/${id}`, { cache: 'no-store' })
        ]);

        // Error handling for nodes list (critical for fleet view)
        if (!nodesRes.ok) {
            return NextResponse.json(
                { error: 'Backend node registry unreachable', status: nodesRes.status },
                { status: nodesRes.status }
            );
        }

        // Error handling for affiliate tree
        if (!affiliatesRes.ok) {
            return NextResponse.json(
                { error: 'Backend affiliate data unreachable', status: affiliatesRes.status },
                { status: affiliatesRes.status }
            );
        }

        const profile = await profileRes.json();
        const allNodes = await nodesRes.json();
        const affiliateTree = await affiliatesRes.json();

        // 3. Filter fleet belonging to this user using deterministic UID order
        const fleet = allNodes.filter((node: any) => {
            const uid = node.userID || node.user_id || node.ownerID;
            return uid === id;
        });

        // 4. Return detailed object as requested
        return NextResponse.json({
            profile,
            fleet,
            affiliateTree,
            stripeVerification: Boolean(profile?.stripeConnectId) // Derived strictly from real field
        });

    } catch (error) {
        console.error(`[Nodl’r Detail Critical Failure for ${id}]:`, error);
        return NextResponse.json({ error: 'Internal Data Aggregation Error', details: String(error) }, { status: 500 });
    }
}
