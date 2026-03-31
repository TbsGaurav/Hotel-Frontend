import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import CityHotelList from './CityHotelList';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { getCityHotels, getCitySidebar } from '@/lib/api/public/cityapi';

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

function getCityPageCookieName(citySlug = '') {
    return `city_page_${toSlug(citySlug).replace(/[^a-z0-9_-]/g, '_')}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function CityDetails({ params }) {
    const { slug } = await params;
    const citySlug = slug?.[0] || '';

    const citySlugPath = toSlug(citySlug);
    const cityName = formatCityName(citySlug);
    const cookieStore = await cookies();
    const pageCookieName = getCityPageCookieName(citySlug);
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);

    let hotels = [];
    let totalCount = 0;
    let sidebarData = {};
    let content = '';
    if (citySlug) {
        try {
            for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
                const pageData = await getCityHotels(citySlug, pageNumber, PAGE_SIZE);
                const nextHotels = pageData || [];

                if (!nextHotels.length) {
                    break;
                }

                hotels = hotels.concat(nextHotels);
            }

            content = hotels[0]?.content || '';
            totalCount = hotels[0]?.totalCount || hotels.length;

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
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            citySlug={citySlug}
                            citySlugPath={citySlugPath}
                            pageCookieName={pageCookieName}
                            content={content}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
