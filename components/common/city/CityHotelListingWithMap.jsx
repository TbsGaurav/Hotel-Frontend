'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from './CityHotelList';

export default function CityHotelListingWithMap({
    sidebarSections = [],
    hotels = [],
    totalCount = 0,
    currentPage = 1,
    pageSize = 10,
    pageCookieName = '',
    pageIntentCookieName = '',
    citySlug = '',
    citySlugPath = '',
    countryId = null,
    content = ''
}) {
    const [isHotelMapVisible, setIsHotelMapVisible] = useState(false);

    useEffect(() => {
        const handler = () => setIsHotelMapVisible((prev) => !prev);
        window.addEventListener('hotel-map-toggle', handler);
        return () => window.removeEventListener('hotel-map-toggle', handler);
    }, []);

    return (
        <div className="row g-0 g-lg-4 align-items-start">
            <div className="col-lg-3 d-none d-lg-block order-lg-1">
                <div className="position-sticky" style={{ top: '16px' }}>
                    <ListingSidebar title="Filters" sections={sidebarSections} />
                </div>
            </div>

            <div className="col-12 col-lg-9 order-1 order-lg-2">
                <CityHotelList
                    hotels={hotels}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageCookieName={pageCookieName}
                    pageIntentCookieName={pageIntentCookieName}
                    citySlug={citySlug}
                    citySlugPath={citySlugPath}
                    countryId={countryId}
                    content={content}
                    mapVisible={isHotelMapVisible}
                    onMapVisibleChange={setIsHotelMapVisible}
                />
            </div>
        </div>
    );
}
