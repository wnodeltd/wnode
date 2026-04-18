import { NextResponse } from 'next/server';

export async function GET() {
    const DISCOVERY_URL = process.env.DISCOVERY_URL || 'http://localhost:8082';
    
    try {
        const res = await fetch(`${DISCOVERY_URL}/api/v1/nodes`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Nodls Proxy Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
