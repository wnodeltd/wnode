import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest) {
    const MESH_API_URL = process.env.MESH_API_URL || 'http://localhost:8081';
    const headers = resolveIdentityHeaders(req);
    
    try {
        const res = await fetch(`${MESH_API_URL}/stats`, { 
            headers,
            cache: 'no-store' 
        });
        const data = await res.json();
        return NextResponse.json({
            ...data,
            redisStatus: 'active'
        });
    } catch (error) {
        console.error('Stats Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch cluster stats' }, { status: 500 });
    }
}
