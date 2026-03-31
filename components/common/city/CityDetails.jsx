import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import CityHotelList from './CityHotelList';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { getCityHotels, getCitySidebar } from '@/lib/api/public/cityapi';
import { getHotelRates } from '@/lib/api/public/hotelapi';

function toSlug(value = '') {
    if (!value) return '';

    return value.toString().trim().toLowerCase().replace(/\s+/g, '-');
}
function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

function normalizeItems(items) {
    return Array.isArray(items) ? items : [];
}

function getSidebarValue(sidebarData, key) {
    if (!sidebarData || !key) return undefined;

    if (Array.isArray(sidebarData[key])) return sidebarData[key];

    const lowerKey = String(key).toLowerCase();
    const matchedKey = Object.keys(sidebarData).find((existingKey) => existingKey.toLowerCase() === lowerKey);

    return matchedKey ? sidebarData[matchedKey] : undefined;
}

function mergeUniqueItems(...groups) {
    const seen = new Set();
    const merged = [];

    for (const group of groups) {
        for (const item of normalizeItems(group)) {
            const label = String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
            const key = label.toLowerCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            merged.push(item);
        }
    }

    return merged;
}

function getSidebarItems(sidebarData, ...keys) {
    for (const key of keys) {
        const value = getSidebarValue(sidebarData, key);
        if (Array.isArray(value)) return value;
    }

    return [];
}

function formatCityName(slug = '') {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const PAGE_SIZE = 10;

export default async function CityDetails({ params }) {
    const { slug } = await params;
    const citySlug = slug?.[0] || '';

    const citySlugPath = toSlug(citySlug);
    const cityName = formatCityName(citySlug);

    let hotels = [];
    let hotelRates = [];
    let totalCount = 0;
    let sidebarData = {};
    let content = '';
    if (citySlug) {
        try {
            let allHotels = [];
            let pageNumber = 1;
            let hasMore = true;

            while (hasMore) {
                const pageData = await getCityHotels(citySlug, pageNumber, PAGE_SIZE);

                if (pageData?.length > 0) {
                    allHotels = allHotels.concat(pageData);
                    content = allHotels[0]?.content || '';

                    // Get totalCount from first request
                    if (pageNumber === 1) {
                        totalCount = pageData[0]?.totalCount || pageData.length;
                    }

                    // Check if we have all hotels
                    if (allHotels.length >= totalCount) {
                        hasMore = false;
                    } else {
                        pageNumber++;
                    }
                } else {
                    hasMore = false;
                }
            }

            hotels = allHotels;

            // Fetch rates for all hotels
            const bookingIds = hotels.map((h) => h.bookingID).filter(Boolean);

            if (bookingIds.length > 0) {
                const ratesRes = await getHotelRates({
                    bookingIds,
                    currency: 'USD',
                    rooms: 1,
                    adults: 2,
                    childs: 0,
                    device: 'desktop'
                });

                hotelRates = ratesRes?.data || [];
            }

            // Fetch sidebar data
            if (hotels.length > 0) {
                const firstHotel = hotels[0];

                const cityId = getFirstDefined(firstHotel?.cityId, firstHotel?.cityID, firstHotel?.CityID);
                const regionId = getFirstDefined(firstHotel?.regionId, firstHotel?.regionID, firstHotel?.RegionID);

                if (cityId) {
                    const sidebar = await getCitySidebar(cityId, regionId);
                    sidebarData = sidebar || {};
                }
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    }

    const hasMoreInitial = false;

    // Build sidebar sections
    const sidebarSections = [
        {
            title: 'Rating',
            items: getSidebarItems(sidebarData, 'ratings', 'rating', 'ratingItems'),
            maxVisible: 6
        },
        {
            title: 'Property Type',
            items: getSidebarItems(sidebarData, 'propertyTypes', 'propertyType', 'propertyTypeItems'),
            maxVisible: 5
        },
        {
            title: 'Facilities',
            items: mergeUniqueItems(
                getSidebarItems(sidebarData, 'roomFacilities', 'roomFacility', 'roomFacilityItems'),
                getSidebarItems(sidebarData, 'hotelFacilities', 'facilityItems', 'facilities')
            ),
            maxVisible: 5
        },
        {
            title: 'City & CBD',
            items: getSidebarItems(sidebarData, 'cityAndCbd', 'cityAndCBD', 'cityAndCbdItems'),
            maxVisible: 5
        },
        {
            title: 'Entertainment',
            items: getSidebarItems(sidebarData, 'entertainment', 'entertainmentItems'),
            maxVisible: 5
        },
        {
            title: 'Relaxation & Exercise',
            items: getSidebarItems(sidebarData, 'relaxationAndExercise', 'relaxation', 'relaxationItems'),
            maxVisible: 5
        }
    ];

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link className="text-primary" href={`/${citySlugPath}`}>
                            {cityName}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <section className="container py-5">
                <h2 className="mb-3">Hotel Accommodation in {cityName}</h2>

                <div className="row g-4 align-items-start">
                    <div className="col-lg-3 order-2 order-lg-1">
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>

                    <div className="col-lg-9 order-1 order-lg-2">
                        <CityHotelList
                            hotels={hotels}
                            initialRates={hotelRates}
                            hasMoreInitial={hasMoreInitial}
                            totalCount={totalCount}
                            content={content}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
