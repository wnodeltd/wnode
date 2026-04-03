import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        return NextResponse.json(simulationState.nodlrs);
    }

    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';

    try {
        // 1. Fetch /api/nodes/all from nodld to discover all active providers
        const nodesRes = await fetch(`${apiUrl}/api/nodlrs/all`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!nodesRes.ok) {
            return NextResponse.json({ error: `Backend nodes list unavailable (${nodesRes.status})` }, { status: nodesRes.status });
        }

        const allNodes = await nodesRes.json();
        
        // 2. Extract unique user IDs and count their nodes
        const userStats: Record<string, { nodeCount: number, totalUptime: number, uptimeCount: number }> = {};
        allNodes.forEach((node: any) => {
            const uid = node.userID || node.user_id || node.ownerID; // Correct extraction order
            if (!uid) return;
            if (!userStats[uid]) {
                userStats[uid] = { nodeCount: 0, totalUptime: 0, uptimeCount: 0 };
            }
            userStats[uid].nodeCount++;

            // Handle both percentage (simulation) and HH:MM:SS (real db) uptime strings
            if (node.uptime) {
                if (typeof node.uptime === 'string' && node.uptime.includes('%')) {
                    const upVal = parseFloat(node.uptime.replace('%', ''));
                    if (!isNaN(upVal)) {
                        userStats[uid].totalUptime += upVal;
                        userStats[uid].uptimeCount++;
                    }
                } else if (typeof node.uptime === 'string' && node.uptime.includes(':')) {
                    // HH:MM:SS - consider it 100% for now if it exists, or calculate health
                    userStats[uid].totalUptime += 100; 
                    userStats[uid].uptimeCount++;
                }
            }
        });

        const uniqueUserIds = Object.keys(userStats);

        // 3. For each unique user ID, fetch /account/:id to get profile details
        const nodlrs = await Promise.all(
            uniqueUserIds.map(async (id) => {
                try {
                    const accRes = await fetch(`${apiUrl}/account/${id}`, {
                        cache: 'no-store',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (!accRes.ok) return null;
                    
                    const accData = await accRes.json();
                    
                    // 4. Return formatted Nodl'r object
                    return {
                        id: accData.id || id,
                        email: accData.email || "N/A",
                        displayName: accData.displayName || (accData.email ? accData.email.split('@')[0] : 'Anonymous'),
                        status: accData.payoutStatus ?? 'pending',
                        nodeCount: userStats[id].nodeCount,
                        accruedFounderBalance: accData.accruedFounderBalance ?? 0,
                        stability: userStats[id].uptimeCount > 0 ? (userStats[id].totalUptime / userStats[id].uptimeCount) : 0,
                        stripeVerification: accData.stripeConnectId ? 'verified' : 'pending',
                        region: accData.region || 'Unknown',
                        accountHealth: accData.accountHealth || 'Neutral',
                        contactInfo: accData.contactInfo || { phone: 'N/A', telegram: 'N/A' },
                        protocolId: accData.protocolId || id
                    };
                } catch (e) {
                    console.error(`Failed to fetch account metadata for ${id}:`, e);
                    return null;
                }
            })
        );

        // Filter failures and return the list
        return NextResponse.json(nodlrs.filter(Boolean));

    } catch (error) {
        console.error('[Nodlrs Route Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
