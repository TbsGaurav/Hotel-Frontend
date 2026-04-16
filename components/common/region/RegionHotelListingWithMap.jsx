'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from '@/components/common/city/CityHotelList';

export default function RegionHotelListingWithMap({
    sidebarSections = [],
    hotels = [],
    totalCount = 0,
    currentPage = 1,
    pageSize = 10,
    citySlug = '',
    pageCookieName = '',
    pageIntentCookieName = '',
    regionHotelsSource = [],
    content = ''
}) {
    const [isHotelMapVisible, setIsHotelMapVisible] = useState(false);

    useEffect(() => {
        const handler = () => setIsHotelMapVisible((prev) => !prev);
        window.addEventListener('hotel-map-toggle', handler);
        return () => window.removeEventListener('hotel-map-toggle', handler);
    }, []);

    return (
        <div className="row g-4 align-items-start">
            <div className="col-lg-3 d-none d-lg-block">
                <div className="position-sticky" style={{ top: '16px' }}>
                    <button
                        type="button"
                        className={`${isHotelMapVisible ? 'theme-button-orange' : 'theme-button-blue'} rounded-2 w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2`}
                        onClick={() => setIsHotelMapVisible((prev) => !prev)}
                    >
                        <FaMapMarkerAlt />
                        <span>Hotel Map</span>
                    </button>

                    <ListingSidebar title="Filters" sections={sidebarSections} />
                </div>
            </div>

            <div className="col-lg-9">
                <CityHotelList
                    hotels={hotels}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    citySlug={citySlug}
                    pageCookieName={pageCookieName}
                    pageIntentCookieName={pageIntentCookieName}
                    regionHotelsSource={regionHotelsSource}
                    content={content}
                    mapVisible={isHotelMapVisible}
                />
            </div>
        </div>
    );
}
