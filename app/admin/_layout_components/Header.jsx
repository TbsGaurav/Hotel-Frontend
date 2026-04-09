'use client';

import { adminlogoutApi } from '@/lib/api/admin/authapi';
import { clearCacheApi } from '@/lib/api/admin/cacheapi';
import { ADMIN_ROUTES } from '@/lib/route';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminHeader() {
    const router = useRouter();
    const [isClearingCache, setIsClearingCache] = useState(false);
    const clearCacheToastId = 'admin-clear-cache';

    const getClearCacheErrorMessage = (error) => {
        const message = error instanceof Error ? error.message : '';

        if (!message || message.startsWith('HTTP Error') || message.startsWith('Invalid JSON response') || message === 'API Error') {
            return 'Failed to clear cache. Please try again.';
        }

        return message.startsWith('Failed to clear cache.') ? message : `Failed to clear cache. ${message}`;
    };

    const getClearCacheSuccessMessage = (result) => {
        const message = typeof result?.message === 'string' ? result.message.trim() : '';

        if (!message || message.toLowerCase() === 'ok') {
            return 'Cache cleared successfully.';
        }

        return message.startsWith('Cache cleared successfully.') ? message : `Cache cleared successfully. ${message}`;
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await adminlogoutApi(token);
            }
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminRole');
            router.push(ADMIN_ROUTES.login);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleClearCache = async () => {
        const token = localStorage.getItem('adminToken');

        if (!token || isClearingCache) {
            if (!token) {
                toast.error('Session expired. Please sign in again to clear the cache.');
            }
            return;
        }

        setIsClearingCache(true);
        toast.loading('Clearing cache...', { id: clearCacheToastId });

        try {
            const result = await clearCacheApi(token);
            toast.success(getClearCacheSuccessMessage(result), {
                id: clearCacheToastId,
                duration: 1500
            });
        } catch (error) {
            console.error('Clear cache error:', error);
            toast.error(getClearCacheErrorMessage(error), {
                id: clearCacheToastId,
                duration: 2000
            });
        } finally {
            setIsClearingCache(false);
        }
    };

    return (
        <header className="py-2 py-md-4 border-bottom bg-white">
            <div className="container-fluid px-5">
                <div className="d-flex justify-content-between align-items-center gap-3">
                    <a href="#" className="my-auto">
                        <Image src="/image/logo.webp" alt="Logo" width={160} height={40} priority />
                    </a>

                    <div className="d-flex align-items-center gap-2 ms-auto flex-wrap justify-content-end">
                        <button
                            type="button"
                            className="theme-button-orange rounded-1"
                            onClick={handleClearCache}
                            disabled={isClearingCache}
                        >
                            {isClearingCache ? 'Clearing...' : 'Clear Cache'}
                        </button>

                        <button type="button" className="theme-button-orange rounded-1" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
