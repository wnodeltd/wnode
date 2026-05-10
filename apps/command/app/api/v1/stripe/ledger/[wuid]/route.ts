import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ wuid: string }> }
) {
    const { wuid } = await params;
    const WNODER_URL = process.env.WNODER_URL || 'http://localhost:8080';
    
    try {
        const res = await fetch(`${WNODER_URL}/api/v1/stripe/ledger/${wuid}`, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json([]);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Stripe Ledger Proxy Error:', error);
        return NextResponse.json([]);
    }
}
