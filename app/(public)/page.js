'use client';

import React, { Fragment } from 'react';
import HeroSection from '../../components/sections/HeroSection';
import FindingBestHotelSection from '../../components/sections/FindingBestHotelSection';
import WeekendGetawayHotelSection from '../../components/sections/WeekendGetawayHotelSection';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const Page = () => {
    useAuthGuard(['User']);

    return (
        <Fragment>
            <HeroSection />
            <FindingBestHotelSection />
            <WeekendGetawayHotelSection />
        </Fragment>
    );
};

export default Page;
