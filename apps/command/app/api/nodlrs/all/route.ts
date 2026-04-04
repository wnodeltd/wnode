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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const nodesRes = await fetch(`${apiUrl}/api/nodlrs/all`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!nodesRes.ok) {
            return NextResponse.json(simulationState.nodlrs);
        }

        const allNodes = await nodesRes.json();
        
        const userStats: Record<string, { nodeCount: number, totalUptime: number, uptimeCount: number }> = {};
        allNodes.forEach((node: any) => {
            const uid = node.userID || node.user_id || node.ownerID;
            if (!uid) return;
            if (!userStats[uid]) {
                userStats[uid] = { nodeCount: 0, totalUptime: 0, uptimeCount: 0 };
            }
            userStats[uid].nodeCount++;

            if (node.uptime) {
                if (typeof node.uptime === 'string' && node.uptime.includes('%')) {
                    const upVal = parseFloat(node.uptime.replace('%', ''));
                    if (!isNaN(upVal)) {
                        userStats[uid].totalUptime += upVal;
                        userStats[uid].uptimeCount++;
                    }
                } else if (typeof node.uptime === 'string' && node.uptime.includes(':')) {
                    userStats[uid].totalUptime += 100; 
                    userStats[uid].uptimeCount++;
                }
            }
        });

        const uniqueUserIds = Object.keys(userStats);

        const nodlrs = await Promise.all(
            uniqueUserIds.map(async (id) => {
                try {
                    const accRes = await fetch(`${apiUrl}/account/${id}`, {
                        cache: 'no-store',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (!accRes.ok) return null;
                    
                    const accData = await accRes.json();
                    
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
                    return null;
                }
            })
        );

        return NextResponse.json(nodlrs.filter(Boolean));

    } catch (error) {
        // Backend unreachable — fall back to simulation data
        return NextResponse.json(simulationState.nodlrs);
    }
}
