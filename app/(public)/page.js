import React, { Fragment } from 'react';
import HeroSection from '../../components/sections/HeroSection';
import FindingBestHotelSection from '../../components/sections/FindingBestHotelSection';
import WeekendGetawayHotelSection from '../../components/sections/WeekendGetawayHotelSection';
import WhyHotelSection from '@/components/sections/WhyHotelSection';
import PriceMatchSection from '@/components/sections/PriceMatchSection';
// import { useAuthGuard } from '@/hooks/useAuthGuard';

const Page = () => {
    // useAuthGuard(['User']);

    return (
        <Fragment>
            <HeroSection />
            <FindingBestHotelSection />
            <WeekendGetawayHotelSection />
            <WhyHotelSection />
            <PriceMatchSection />
        </Fragment>
    );
};

export default Page;
