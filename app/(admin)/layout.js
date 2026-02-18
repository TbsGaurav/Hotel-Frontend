// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AdminLayout({ children }) {
//     const router = useRouter();

//     useEffect(() => {
//         const token = localStorage.getItem('adminToken');
//         console.log(token);
//         const role = localStorage.getItem('adminRole');

//         const allowedRoles = ['Admin', 'Editor', 'Viewer'];

//         if (!token) {
//             router.replace('/auth/login');
//             return;
//         }

//         if (!allowedRoles.includes(role)) {
//             router.replace('/');
//             return;
//         }
//     }, []);

//     return <>{children}</>;
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from './_layout_components/Header';
import AdminTopNav from './_layout_components/AdminTopNav';

export default function AdminLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('adminRole');

        if (!token) {
            router.replace('/auth/login');
            return;
        }

        if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
            router.replace('/');
            return;
        }
    }, []);

    return (
        <>
            {' '}
            <div className="min-vh-100 d-flex flex-column">
                <AdminHeader />
                <AdminTopNav />

                <main className="flex-fill p-4 bg-light">{children}</main>
            </div>
        </>
    );
}
