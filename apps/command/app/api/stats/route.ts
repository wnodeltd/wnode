import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../lib/simulationState';

export async function GET() {
    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';

    if (isSimulated) {
        let activeNodes = 0;
        let flaggedNodes = 0;
        let totalCores = 0;
        let totalMemory = 0;
        let totalUptime = 0;
        let uptimeCount = 0;

        simulationState.nodls.forEach((node: any) => {
            if (node.status === 'active') activeNodes++;
            if (node.flagged === true) flaggedNodes++;
            totalCores += Number(node.cpuCores || 0);
            totalMemory += Number(node.memoryGB || 0);

            if (node.uptime) {
                const upVal = parseFloat(node.uptime.replace('%', ''));
                if (!isNaN(upVal)) {
                    totalUptime += upVal;
                    uptimeCount++;
                }
            }
        });

        const totalBalance = simulationState.nodlrs.reduce((sum, n) => sum + (n.accruedFounderBalance || 0), 0);

        return NextResponse.json({
            totalNodes: simulationState.nodls.length,
            activeNodes,
            offlineNodes: simulationState.nodls.length - activeNodes,
            totalNodlrs: simulationState.nodlrs.length,
            flaggedNodes,
            totalCores,
            totalMemory,
            totalBalance,
            globalStability: uptimeCount > 0 ? (totalUptime / uptimeCount) : 0,
            redisStatus: 'in-memory'
        });
    }

    try {
        // 1. Fetch /api/nodes/all from nodld as the single source of truth
        const nodesRes = await fetch(`${apiUrl}/api/nodls/all`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!nodesRes.ok) {
            return NextResponse.json(
                { error: 'Backend node registry unreachable', status: nodesRes.status }, 
                { status: nodesRes.status }
            );
        }

        const allNodes = await nodesRes.json();
        
        // 2. Compute metrics strictly from node list data
        let activeNodes = 0;
        let flaggedNodes = 0;
        let totalCores = 0;
        let totalMemory = 0;
        let totalUptime = 0;
        let uptimeCount = 0;
        const uniqueNodlrs = new Set<string>();

        Object.values(allNodes || {}).forEach((node: any) => {

            // Count Active
            if (node.status === 'active') activeNodes++;
            
            // Count Flagged
            if (node.flagged === true) flaggedNodes++;
            
            // Collect Unique Nodl'rs
            const uid = node.userID || node.user_id || node.ownerID;
            if (uid) uniqueNodlrs.add(uid);

            // Compute aggregations
            totalCores += Number(node.cpuCores || node.cpu_cores || 0);
            totalMemory += Number(node.memoryGB || node.memory_gb || 0);

            // Uptime average
            if (node.uptime) {
                if (typeof node.uptime === 'string' && node.uptime.includes('%')) {
                    const upVal = parseFloat(node.uptime.replace('%', ''));
                    if (!isNaN(upVal)) {
                        totalUptime += upVal;
                        uptimeCount++;
                    }
                } else if (typeof node.uptime === 'string' && node.uptime.includes(':')) {
                    totalUptime += 100; // Consider online HH:MM:SS as healthy
                    uptimeCount++;
                }
            }
        });

        // 3. Fetch balances for all unique Nodl'rs (Admin context)
        let totalBalance = 0;
        try {
            const balances = await Promise.all(
                Array.from(uniqueNodlrs).map(async (id) => {
                    const res = await fetch(`${apiUrl}/account/${id}`, { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        return data.accruedFounderBalance || 0;
                    }
                    return 0;
                })
            );
            totalBalance = balances.reduce((sum, b) => sum + b, 0);
        } catch (e) {
            console.warn('[Stats Balance Fetch Warning]:', e);
        }

        // 4. Return aggregated JSON object
        const totalNodesCount = Object.keys(allNodes || {}).length;
        return NextResponse.json({
            totalNodes: totalNodesCount,
            activeNodes: activeNodes,
            offlineNodes: totalNodesCount - activeNodes,
            totalNodlrs: uniqueNodlrs.size,
            flaggedNodes: flaggedNodes,
            totalCores,
            totalMemory,
            totalBalance,
            globalStability: uptimeCount > 0 ? (totalUptime / uptimeCount) : 0,
            redisStatus: 'in-memory'
        });

    } catch (error) {
        console.error('[Dashboard Stats Failure]:', error);
        return NextResponse.json(
            { error: 'Internal Stats Aggregation Error', details: String(error) }, 
            { status: 500 }
        );
    }
}
