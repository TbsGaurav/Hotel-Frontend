import React, { Fragment } from 'react';
import HeroSection from '../../components/sections/HeroSection';
import FindingBestHotelSection from '../../components/sections/FindingBestHotelSection';
import WeekendGetawayHotelSection from '../../components/sections/WeekendGetawayHotelSection';

const page = () => {
    return (
        <Fragment>
            <HeroSection />
            <FindingBestHotelSection />
            <WeekendGetawayHotelSection />
        </Fragment>
    );
};

export default page;
