import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import Dropdown from '@/components/ui/Dropdown';
import { getCitiesByRegion } from '@/lib/api/public/countryapi';
import { getCityHotels } from '@/lib/api/public/cityapi';
import { getSidebarData } from '@/lib/api/sidebarapi';
import { getRegionHotels } from '@/lib/api/public/regionapi';
import CityHotelList from '../city/CityHotelList';
import { formatCountryName } from '@/lib/utils';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';

const REGION_PAGE_SIZE = 10;

function toSlug(value = '') {
    return value.toLowerCase().replace(/\s+/g, '-');
}

function getRegionPageCookieName(countrySlug = '', regionSlug = '') {
    return `region_page_${toSlug(countrySlug)}_${toSlug(regionSlug)}`;
}
function getRegionPageIntentCookieName(countrySlug = '', regionSlug = '') {
    return `region_page_intent_${toSlug(countrySlug)}_${toSlug(regionSlug)}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

function getCitySlug(city = {}) {
    return String(city.cityUrlName || city.urlName || city.slug || city.cityName || '')
        .trim()
        .replace(/^\/+/, '');
}

async function fetchAllHotelsFromCities(cities = [], hotelsPerPage = REGION_PAGE_SIZE) {
    const orderedCities = [...cities].sort((a, b) =>
        String(a?.cityName || '').localeCompare(String(b?.cityName || ''), undefined, {
            sensitivity: 'base'
        })
    );

    const cityHotelBatches = await Promise.all(
        orderedCities.map(async (city) => {
            const citySlug = getCitySlug(city);

            if (!citySlug) {
                return [];
            }

            const cityHotels = [];
            let cityPage = 1;

            while (true) {
                const hotelsForPage = await getCityHotels(citySlug, cityPage, hotelsPerPage);

                if (!hotelsForPage.length) {
                    break;
                }

                cityHotels.push(...hotelsForPage);

                if (hotelsForPage.length < hotelsPerPage) {
                    break;
                }

                cityPage += 1;
            }

            return cityHotels;
        })
    );

    return cityHotelBatches.flat();
}

export default async function RegionDetails({ params, regionId }) {
    const { slug } = await params;

    const countrySlug = slug?.[0] || '';
    const regionSlug = slug?.[1] || '';
    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);

    const urlName = `/${countrySlug}/${regionSlug}`;

    const response = await getCitiesByRegion(countrySlug, regionSlug);
    const regionData = response?.data;
    const cities = Array.isArray(regionData) ? regionData : regionData?.cities || regionData?.regionData || [];
    const description = regionData?.regionContent || regionData?.content || cities?.[0]?.regionContent || '';

    const cityItems = cities.map((city) => ({
        label: city.cityName,
        count: city.hotelCount,
        href: `/${String(city.cityName || '')
            .toLowerCase()
            .replace(/\s+/g, '-')}`
    }));

    let sidebarData = {};
    if (regionId) {
        try {
            sidebarData = await getSidebarData({ regionId });
        } catch (error) {
            console.error('Error fetching region sidebar data:', error);
        }
    }

    const sidebarSections = buildSidebarSections(sidebarData, {
        contextName: regionName,
        propertyTypeHeader: regionName ? `${regionName} Hotels` : 'Property Type'
    });

    const cookieStore = await cookies();
    const regionPageCookieName = getRegionPageCookieName(countrySlug, regionSlug);
    const pageIntentCookieName = getRegionPageIntentCookieName(countrySlug, regionSlug);
    const hasPaginationIntent = Boolean(cookieStore.get(pageIntentCookieName)?.value);
    const currentPage = hasPaginationIntent ? parsePageNumber(cookieStore.get(regionPageCookieName)?.value) : 1;

    const requestedCount = currentPage * REGION_PAGE_SIZE;

    let hotels = [];
    let totalCount = cities.reduce((sum, city) => sum + Number(city?.hotelCount || 0), 0);
    let fallbackRegionHotels = [];

    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const res = await getRegionHotels(urlName, pageNumber, REGION_PAGE_SIZE);

            const nextHotels = res?.hotelData || [];

            if (!nextHotels.length) break;

            hotels = hotels.concat(nextHotels);
            totalCount = res?.totalCount || 0;
        }

        if (!hotels.length && cities.length > 0) {
            fallbackRegionHotels = await fetchAllHotelsFromCities(cities, REGION_PAGE_SIZE);
            totalCount = fallbackRegionHotels.length;
            hotels = fallbackRegionHotels.slice(0, requestedCount);
        }
    } catch (err) {
        console.error('Region hotels error:', err);
    }

    return (
        <>
            <CountryHeroSection />

            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>
                        <span className="mx-2 text-muted">&bull;</span>
                        <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                            {countryName}
                        </Link>
                        <span className="mx-2 text-muted">&bull;</span>
                        <span className="text-primary">{regionName}</span>
                    </div>
                </div>
            </div>

            <section className="container py-4">
                <div className="row">
                    <Dropdown id="regions" parentId="countryAccordion" title="Cities" items={cityItems} defaultOpen />

                    <hr className="my-5" />

                    <div className="col-lg-3">
                        <ListingSidebar title="Filters" sections={sidebarSections} />
                    </div>

                    <div className="col-lg-9">
                        <h2 className="text-center fw-bold mb-4">Featured Properties in {regionName}</h2>
                        <CityHotelList
                            hotels={hotels}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={REGION_PAGE_SIZE}
                            pageCookieName={regionPageCookieName}
                            pageIntentCookieName={pageIntentCookieName}
                            regionHotelsSource={fallbackRegionHotels}
                            content={description}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
