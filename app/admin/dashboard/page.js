'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';

const Page = () => {
    useAuthGuard(['Admin', 'Editor', 'Viewer']);

    return (
        <div className="d-grid gap-4">
            <div className="card shadow-sm mb-0 bg-white rounded-2">
                <div className="card-body">
                    <p className="card-text mb-0">Welcome to the admin dashboard!</p>
                </div>
            </div>
        </div>
    );
};

export default Page;
