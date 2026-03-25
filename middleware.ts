import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Just pass through all requests — auth is handled client-side
    // This prevents cookie-timing issues with Supabase session
    return NextResponse.next();
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
};
