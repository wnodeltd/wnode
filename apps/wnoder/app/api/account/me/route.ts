import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || 'http://localhost:8081';

    try {
        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                // Forward all cookies (including nodlr_session) and auth headers
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend identity provider returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        
        // Pure Backend Truth: No role or profile overrides allowed in the proxy.
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}
