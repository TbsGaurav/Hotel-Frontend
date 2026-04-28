'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ListingSidebar, { getVisibleSidebarSections } from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from './CityHotelList';
import HotelListToolbar from '@/components/common/listing/HotelListToolbar';

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
        <div className="container p-0">
            {content && <div className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: content }} />}

            {!isMobileViewport && (
                <HotelListToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    mapVisible={isHotelMapVisible}
                    onMapToggle={() => setIsHotelMapVisible((prev) => !prev)}
                    resultsCount={totalCount || hotels.length}
                    className="mb-2"
                />
            )}

            <div className="row g-0 g-lg-4 align-items-start">
                {hasSidebar ? (
                    <div className="col-lg-3 d-none d-lg-block order-lg-1">
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>
                ) : null}

                <div className={hasSidebar ? 'col-12 col-lg-9 order-1 order-lg-2' : 'col-12'}>
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
