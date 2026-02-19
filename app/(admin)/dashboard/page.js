'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import React from 'react';

const Page = () => {
    useAuthGuard(['Admin', 'Editor', 'Viewer']);

    return <div>dashboard</div>;
};

export default Page;
