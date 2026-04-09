import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import Dropdown from '@/components/ui/Dropdown';
import { getCitiesByRegion } from '@/lib/api/public/regionapi';
import { getHotelList } from '@/lib/api/public/hotelapi';
import { getSidebarData } from '@/lib/api/sidebarapi';
import CityHotelList from '../city/CityHotelList';
import { formatCountryName } from '@/lib/utils';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { buildCategoryListingPath } from '@/lib/api/public/cityCategoryapi';

const REGION_PAGE_SIZE = 10;

function toSlug(value = '') {
    return value.toLowerCase().replace(/\s+/g, '-');
}

function buildRegionCategorySlug(label = '', regionSlug = '', sectionId = '') {
    const normalizedLabel = toSlug(label);
    const normalizedRegion = toSlug(regionSlug);
    if (!normalizedLabel) return '';
    if (sectionId === 'property-type' && normalizedRegion) {
        return `${normalizedRegion}-${normalizedLabel}`;
    }
    return normalizedLabel;
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
                const pageResponse = await getHotelList(citySlug, cityPage, hotelsPerPage);
                const hotelsForPage = pageResponse?.hotels || [];

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

    const urlName = `${countrySlug}/${regionSlug}`;

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
    const normalizedRegionSlug = toSlug(regionSlug);

    const cookieStore = await cookies();
    const regionPageCookieName = getRegionPageCookieName(countrySlug, regionSlug);
    const pageIntentCookieName = getRegionPageIntentCookieName(countrySlug, regionSlug);
    const currentPage = parsePageNumber(cookieStore.get(regionPageCookieName)?.value);

    const requestedCount = currentPage * REGION_PAGE_SIZE;

    let hotels = [];
    let totalCount = cities.reduce((sum, city) => sum + Number(city?.hotelCount || 0), 0);
    let fallbackRegionHotels = [];
    let resolvedRegionId = regionId;

    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageResponse = await getHotelList(urlName, pageNumber, REGION_PAGE_SIZE);
            const nextHotels = pageResponse?.hotels || [];

            if (!nextHotels.length) break;

            if (pageNumber === 1) {
                if (pageResponse?.regionId) {
                    resolvedRegionId = pageResponse.regionId;
                }
                totalCount = pageResponse?.totalCount || 0;
            }

            hotels = hotels.concat(nextHotels);
        }

        if (!hotels.length && cities.length > 0) {
            fallbackRegionHotels = await fetchAllHotelsFromCities(cities, REGION_PAGE_SIZE);
            totalCount = fallbackRegionHotels.length;
            hotels = fallbackRegionHotels.slice(0, requestedCount);
        }
    } catch (err) {
        console.error('Region hotels error:', err);
    }

    // Fetch sidebar data using extracted regionId
    let sidebarData = {};
    if (resolvedRegionId) {
        try {
            sidebarData = await getSidebarData({ regionId: resolvedRegionId });
        } catch (error) {
            console.error('Error fetching region sidebar data:', error);
        }
    }

    const sidebarSections = buildSidebarSections(sidebarData, {
        contextName: regionName,
        propertyTypeHeader: regionName ? `${regionName} Hotels` : 'Property Type'
    });

    const sidebarSectionsWithLinks = sidebarSections.map((section) => ({
        ...section,
        items: (section.items || []).map((item) => {
            const label = String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
            const categoryId = item?.categoryId ?? item?.CategoryId ?? item?.id ?? null;
            const categorySlug = buildRegionCategorySlug(label, normalizedRegionSlug, section.sectionId);
            if (!categorySlug) return item;
            const query = new URLSearchParams();
            if (categoryId !== null && categoryId !== undefined && categoryId !== '') {
                query.set('categoryId', String(categoryId));
            }
            if (resolvedRegionId !== null && resolvedRegionId !== undefined && resolvedRegionId !== '') {
                query.set('regionId', String(resolvedRegionId));
            }
            if (countrySlug) {
                query.set('country', String(countrySlug));
            }

            const baseHref = buildCategoryListingPath(normalizedRegionSlug, categorySlug);
            const href = query.toString() ? `${baseHref}?${query.toString()}` : baseHref;

            return {
                ...item,
                href,
                categoryId,
                regionId: resolvedRegionId
            };
        })
    }));

    return (
        <>
            <CountryHeroSection />
            <section className="mobile-actions d-lg-none">
                <div className="container px-0">
                    <div className="mobile-actions__bottom">
                        <button type="button" className="mobile-actions__link">
                            Sort
                        </button>
                        <MobileFilterDrawer sidebarSections={sidebarSections} />
                        <button type="button" className="mobile-actions__link">
                            Map
                        </button>
                    </div>
                </div>
            </section>
            <div className="py-2 py-lg-3">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/destinations" className="text-dark text-decoration-none">
                                    All Countries
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px">
                                <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                                    {countryName}
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px active text-capitalize">
                                <Link href={`/${countrySlug}/${regionSlug}`} className="text-decoration-none">
                                    {regionName}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="container py-2">
                <div className="row g-4 align-items-start">
                    <Dropdown id="regions" parentId="countryAccordion" title="Cities" items={cityItems} defaultOpen />
                    <hr className="my-5" />

                    <div className="col-lg-3 d-none d-lg-block">
                        <ListingSidebar title="Filters" sections={sidebarSectionsWithLinks} />
                    </div>
                    <div className="col-lg-9">
                        <h2 className="text-center fw-bold mb-4">Featured Properties in {regionName}</h2>
                        <CityHotelList
                            hotels={hotels}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={REGION_PAGE_SIZE}
                            citySlug={urlName}
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
