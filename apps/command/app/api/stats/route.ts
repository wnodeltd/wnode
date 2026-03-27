import { NextResponse } from 'next/server';

export async function GET() {
    // Strict IP Standardization for Fedora compatibility
    const apiUrl = process.env.NODLD_API_URL || 'https://api.nodl.one';

    try {
        const res = await fetch(`${apiUrl}/stats`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(2000), // Prevent UI hang
        });

        if (!res.ok) {
            return NextResponse.json({
                status: 'error',
                message: 'Backend Offline',
                activeNodes: 0,
                networkLoad: 0,
                logs: []
            }, { status: 503 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Pulse Proxy Failure]:', error);
        return NextResponse.json({
            status: 'offline',
            message: 'Backend Offline',
            activeNodes: 0,
            networkLoad: 0,
            logs: [{ timestamp: new Date().toISOString(), message: `SYSTEM CRITICAL: NODLD DAEMON UNREACHABLE AT ${apiUrl}` }]
        }, { status: 503 });
    }
}
