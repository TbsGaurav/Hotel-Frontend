'use client';

import { adminlogoutApi } from '@/lib/api/admin/authapi';
import { ADMIN_ROUTES } from '@/lib/route';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const router = useRouter();
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

    return (
        <header className="py-2 py-md-4 border-bottom bg-white">
            <div className="container-fluid px-5">
                <div className="d-flex justify-content-between align-items-center">
                    <a href="#" className="my-auto">
                        <Image src="/image/logo.webp" alt="Logo" width={160} height={40} priority />
                    </a>

                    <button className=" theme-button-orange rounded-1" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
