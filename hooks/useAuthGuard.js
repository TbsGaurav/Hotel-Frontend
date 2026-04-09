'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/lib/route';

export function useAuthGuard(allowedRoles = []) {
    const router = useRouter();
    const allowedRolesKey = allowedRoles.join('|');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('adminRole');
        const normalizedAllowedRoles = allowedRolesKey ? allowedRolesKey.split('|') : [];

        // Not logged in
        if (!token) {
            router.replace(ADMIN_ROUTES.login);
            return;
        }

        // If roles are provided, check role access
        if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(role)) {
            if (role === 'User') {
                router.replace('/');
            } else {
                router.replace(ADMIN_ROUTES.dashboard);
            }
        }
    }, [router, allowedRolesKey]);
}
