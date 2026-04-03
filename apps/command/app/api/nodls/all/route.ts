import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        const enrichedNodes = simulationState.nodls.map(node => {
            const operator = simulationState.nodlrs.find(n => n.id === node.userID || n.protocolId === node.userID);
            return {
                ...node,
                name: operator?.name || 'ANONYMOUS',
                region: operator?.region || 'Unknown',
                protocolId: node.protocolId || operator?.protocolId || node.userID
            };
        });
        return NextResponse.json(enrichedNodes);
    }

    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';

    try {
        const res = await fetch(`${apiUrl}/api/nodls/all`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend registry unavailable (${res.status})` }, 
                { status: res.status }
            );
        }

        const nodes = await res.json();
        return NextResponse.json(nodes);

    } catch (error) {
        console.error('[Nodes All Proxy Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
