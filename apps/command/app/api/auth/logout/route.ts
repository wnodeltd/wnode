import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    
    // Clear the cmd_session cookie
    response.cookies.set({
        name: 'cmd_session',
        value: '',
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    });
    
    return response;
}
