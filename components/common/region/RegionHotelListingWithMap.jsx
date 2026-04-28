'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ListingSidebar, { getVisibleSidebarSections } from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from '@/components/common/city/CityHotelList';
import HotelListToolbar from '@/components/common/listing/HotelListToolbar';

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
    const [viewMode, setViewMode] = useState('list');
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const hasSidebar = getVisibleSidebarSections(sidebarSections).length > 0;

    useEffect(() => {
        const syncViewport = () => {
            setIsMobileViewport(window.innerWidth < 768);
        };
        syncViewport();
        window.addEventListener('resize', syncViewport);
        return () => window.removeEventListener('resize', syncViewport);
    }, []);

    useEffect(() => {
        const handler = () => setIsHotelMapVisible((prev) => !prev);
        window.addEventListener('hotel-map-toggle', handler);
        return () => window.removeEventListener('hotel-map-toggle', handler);
    }, []);

    return (
        <div className="p-0">
            {content ? <div className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: content }} /> : null}

            {!isMobileViewport ? (
                <HotelListToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    mapVisible={isHotelMapVisible}
                    onMapToggle={() => setIsHotelMapVisible((prev) => !prev)}
                    resultsCount={totalCount || hotels.length}
                    className="mb-2"
                />
            ) : null}

            <div className="row g-4 align-items-start">
            {hasSidebar ? (
                <div className="col-lg-3 d-none d-lg-block">
                    <div className="position-sticky" style={{ top: '16px' }}>
                        <ListingSidebar title="Filters" sections={sidebarSections} />
                    </div>
                </div>
            ) : null}

            <div className={hasSidebar ? 'col-lg-9' : 'col-12'}>
                <CityHotelList
                    hotels={hotels}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    citySlug={citySlug}
                    pageCookieName={pageCookieName}
                    pageIntentCookieName={pageIntentCookieName}
                    regionHotelsSource={regionHotelsSource}
                    content=""
                    mapVisible={isHotelMapVisible}
                    onMapVisibleChange={setIsHotelMapVisible}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    showToolbar={false}
                />
            </div>
            </div>
        </div>
    );
}
