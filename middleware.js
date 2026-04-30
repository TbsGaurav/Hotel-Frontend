import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, search } = request.nextUrl;
    const searchParams = request.nextUrl.searchParams;

    const isRscRequest =
        searchParams.has('_rsc') ||
        request.headers.get('RSC') === '1' ||
        request.headers.get('Next-Router-Prefetch') === '1' ||
        request.headers.get('Next-Router-State-Tree') !== null;

    // 1. Skip root and files that already have an extension (other than .htm)
    if (isRscRequest || pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const lowercasePathname = pathname.toLowerCase();
    const isAdminPath = pathname.startsWith('/admin');
    const hasHtmExtension = lowercasePathname.endsWith('.htm');
    
    // 2. ADMIN Logic: No .htm, enforce lowercase
    if (isAdminPath) {
        // If it has .htm, redirect to clean path
        if (hasHtmExtension) {
            const cleanAdminPath = pathname.slice(0, -4);
            return NextResponse.redirect(new URL(cleanAdminPath.toLowerCase() + search, request.url), 301);
        }
        // If has uppercase, redirect to lowercase
        if (/[A-Z]/.test(pathname)) {
            return NextResponse.redirect(new URL(lowercasePathname + search, request.url), 301);
        }
        return NextResponse.next();
    }

    // 3. PUBLIC Logic: Force lowercase AND .htm
    if (/[A-Z]/.test(pathname) || !hasHtmExtension) {
        let targetPathname = lowercasePathname;
        if (!hasHtmExtension && !targetPathname.includes('.')) {
            targetPathname += '.htm';
        }
        
        if (targetPathname !== pathname) {
            return NextResponse.redirect(new URL(targetPathname + search, request.url), 301);
        }
    }

    // 4. REWRITE: If we have .htm (public routes), internally rewrite to clean path
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
