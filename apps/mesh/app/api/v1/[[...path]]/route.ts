import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(req, path);
}

async function handleRequest(req: NextRequest, path: string[]) {
    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    const pathString = path?.join('/') || '';
    const url = new URL(req.url);
    const searchParams = url.search;
    
    const targetUrl = `${apiUrl}/api/v1/${pathString}${searchParams}`;

    try {
    let body: Blob | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentLength = req.headers.get('content-length');
        if (contentLength && contentLength !== '0') {
            body = await req.blob();
        }
    }
        
        const res = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': req.headers.get('content-type') || 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
            body: body,
            cache: 'no-store'
        });

        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            const data = await res.json();
            return NextResponse.json(data, { status: res.status });
        } else {
            const data = await res.blob();
            return new NextResponse(data, { 
                status: res.status,
                headers: { 'Content-Type': contentType || 'application/octet-stream' }
            });
        }
    } catch (error) {
        console.error(`[API Proxy Error] ${req.method} ${targetUrl}:`, error);
        return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
    }
}
