'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const router = useRouter();

    return (
        <header className="py-2 py-md-4">
            <div className="container">
                <div className="row">
                    <div className="col-6 col-md-3 d-flex justify-content-between justify-content-md-start">
                        <a href="index.html" className="my-auto">
                            <Image src="/image/logo.webp" alt="" width={160} height={40} priority />
                        </a>
                    </div>
                </div>
            </div>
        </header>
        // <header className="admin-header bg-dark text-white px-4 py-3 d-flex justify-content-between">
        //     <h5 className="mb-0">Admin Panel</h5>

        //     <div className="d-flex align-items-center gap-3">

        //         {/* <button className="btn btn-sm btn-danger" onClick={handleLogout}>
        //             Logout
        //         </button> */}
        //     </div>
        // </header>
    );
}
