import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest) {
    const MESH_API_URL = process.env.MESH_API_URL || 'http://localhost:8081';
    const headers = resolveIdentityHeaders(req);
    
    try {
        const res = await fetch(`${MESH_API_URL}/api/v1/nodlrs`, { 
            headers,
            cache: 'no-store' 
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Nodlrs Proxy Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
