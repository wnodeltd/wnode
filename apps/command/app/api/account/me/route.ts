import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.WNODER_URL || process.env.NODLD_API_URL || 'http://localhost:8080';

    // Forward the Authorization header from the client
    const authHeader = req.headers.get('authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');

    // Also check cookie-based token as fallback
    const cookieToken = req.cookies.get('nodl_jwt')?.value;
    const token = jwt || cookieToken || '';

    try {
        const res = await fetch(`${apiUrl}/account/me`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend account endpoint returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();

        // MERGE CRM PROFILE (Static Data Record for Stephen)
        if (data.id === '100001-0426-01-AA') {
            return NextResponse.json({
                ...data,
                firstName: 'Stephen',
                lastName: 'Soos',
                displayName: 'Stephen Soos',
                photoUrl: '/logo.webp', // Using institutional logo as fallback profile photo
                role: 'owner',
                protocolId: '100001-0426-01-AA'
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Failed to reach backend account service' },
            { status: 502 }
        );
    }
}
