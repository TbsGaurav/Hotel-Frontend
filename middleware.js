import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, search } = request.nextUrl;

    // 1. Skip root and files that already have an extension (other than .htm)
    if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const lowercasePathname = pathname.toLowerCase();
    const hasHtmExtension = lowercasePathname.endsWith('.htm');
    
    // 2. REDIRECT: If URL is not lowercase OR missing .htm
    // This forces the browser URL to be lowercase and end with .htm
    if (/[A-Z]/.test(pathname) || !hasHtmExtension) {
        let targetPathname = lowercasePathname;
        if (!hasHtmExtension && !targetPathname.includes('.')) {
            targetPathname += '.htm';
        }
        
        // If we actually changed something, redirect
        if (targetPathname !== pathname) {
            return NextResponse.redirect(new URL(targetPathname + search, request.url), 301);
        }
    }

    // 3. REWRITE: If we have .htm, internally rewrite to the clean path for Next.js folder matching
    if (hasHtmExtension) {
        const cleanPathname = pathname.slice(0, -4);
        return NextResponse.rewrite(new URL(cleanPathname + search, request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)).*)'
    ]
};
