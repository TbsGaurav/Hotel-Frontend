'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard(allowedRoles = []) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('adminRole');

        // Not logged in
        if (!token) {
            router.replace('/auth/login');
            return;
        }

        // If roles are provided, check role access
        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            // If user is normal user → go home
            if (role === 'User') {
                router.replace('/');
            } else {
                router.replace('/dashboard');
            }
        }
    }, [router, allowedRoles]);
}
