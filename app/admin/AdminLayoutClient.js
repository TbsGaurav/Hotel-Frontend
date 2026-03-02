'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminHeader from './_layout_components/Header';
import AdminTopNav from './_layout_components/AdminTopNav';
import { ADMIN_ROUTES } from '@/lib/route';

export default function AdminLayoutClient({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const hideHeader = pathname === ADMIN_ROUTES.login;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('adminRole');

        if (!token) {
            router.replace(ADMIN_ROUTES.login);
            return;
        }

        if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
            router.replace('/');
            return;
        }
    }, [router]);

    return (
        <div className="min-vh-100 d-flex flex-column">
            {!hideHeader && <AdminHeader />}
            {!hideHeader && <AdminTopNav />}
            <main className="flex-fill p-4 bg-light">{children}</main>
        </div>
    );
}
