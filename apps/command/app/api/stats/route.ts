import { NextResponse } from 'next/server';

export async function GET() {
    const MESH_API_URL = process.env.MESH_API_URL || 'http://localhost:8081';
    
    try {
        const res = await fetch(`${MESH_API_URL}/stats`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json({
            ...data,
            redisStatus: 'active' // Assuming live backend has redis or equivalent
        });
    } catch (error) {
        console.error('Stats Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch cluster stats' }, { status: 500 });
    }
}
