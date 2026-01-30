import React, { Fragment } from 'react';
import HeroSection from './HeroSection';
import FindingBestHotelSection from './FindingBestHotelSection';
import WeekendGetawayHotelSection from './WeekendGetawayHotelSection';

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
