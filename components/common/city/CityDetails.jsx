import AppLink from '@/components/common/AppLink';
import { cookies } from 'next/headers';
import HeroSection from '@/components/sections/HeroSection';
import CityHotelListingWithMap from './CityHotelListingWithMap';
import { getHotelList } from '@/lib/api/public/hotelapi';
import { getCountriesApi } from '@/lib/api/public/countryapi';
import { getSidebarData } from '@/lib/api/sidebarapi';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { buildCategorySidebarSections } from '@/lib/api/public/cityCategoryapi';
import { buildCitySeo } from '@/lib/seo';
import SeoDetailsCard from '@/components/common/SeoDetailsCard';
import MobileHotelMapButton from '@/components/common/listing/MobileHotelMapButton';

// Utility functions
function toSlug(value = '') {
    if (!value) return '';
    return value.toString().trim().toLowerCase().replace(/\s+/g, '-');
}

function getCityPageIntentCookieName(citySlug = '') {
    return `city_page_intent_${toSlug(citySlug).replace(/[^a-z0-9_-]/g, '_')}`;
}
function getBookingCountryCode(url = '') {
    const match = String(url || '').match(/\/hotel\/([a-z]{2})\//i);
    return match?.[1]?.toLowerCase() || '';
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

export default async function CityDetails({ params, resolvedSlugData = {} }) {
    const { slug } = await params;
    const citySlug = slug?.[0] || '';
    const citySlugPath = toSlug(citySlug);
    const cityName = formatCityName(citySlug);
    const cookieStore = await cookies();
    const pageCookieName = getCityPageCookieName(citySlug);
    const pageIntentCookieName = getCityPageIntentCookieName(citySlug);
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);

    let hotels = [];
    let totalCount = 0;
    let sidebarData = {};
    let content = '';
    let countryName = '';
    let countryUrl = '';
    let regionName = '';
    let regionUrl = '';
    let firstHotel = null;

    const cookieCountryIdRaw = cookieStore.get('countryId')?.value ?? cookieStore.get('countryid')?.value ?? null;
    const cookieCountryId = Number(cookieCountryIdRaw);
    let resolvedCountryId = Number.isInteger(cookieCountryId) && cookieCountryId > 0 ? cookieCountryId : null;

    if (citySlug) {
        try {
            for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
                let pageResponse = await getHotelList(citySlug, { countryId: resolvedCountryId, pageNumber, pageSize: PAGE_SIZE });

                if (pageNumber === 1 && (resolvedCountryId === null || resolvedCountryId === undefined)) {
                    const responseCountryId = Number(pageResponse?.countryId);
                    if (Number.isInteger(responseCountryId) && responseCountryId > 0) {
                        resolvedCountryId = responseCountryId;
                        pageResponse = await getHotelList(citySlug, { countryId: resolvedCountryId, pageNumber, pageSize: PAGE_SIZE });
                    }
                }
                const nextHotels = pageResponse?.hotels || [];

                if (!nextHotels.length) {
                    break;
                }

                if (pageNumber === 1) {
                    totalCount = pageResponse?.totalCount || nextHotels.length;
                    content = nextHotels[0]?.content || '';
                    resolvedCountryId = resolvedCountryId ?? (pageResponse?.countryId ?? null);

                    // Extract IDs from API response (not from first hotel)
                    const apiCityId = pageResponse?.cityId;
                    if (apiCityId !== null && apiCityId !== undefined) {
                        sidebarData = await getSidebarData({ cityId: apiCityId });
                    }
                }

                hotels = hotels.concat(nextHotels);
            }

            if (hotels.length > 0) {
                firstHotel = hotels[0];
                countryName = firstHotel?.countryName || firstHotel?.country || '';
                countryUrl = firstHotel?.countryUrlName || firstHotel?.countryUrl || toSlug(countryName);
                regionName = firstHotel?.regionName || firstHotel?.region || '';
                regionUrl = firstHotel?.regionUrlName || firstHotel?.regionUrl || toSlug(regionName);

                if (!countryName || !countryUrl) {
                    const countryCode = getBookingCountryCode(firstHotel?.url);

                    if (countryCode) {
                        const countries = await getCountriesApi();
                        const matchedCountry = Array.isArray(countries)
                            ? countries.find((country) => String(country?.code || '').toLowerCase() === countryCode)
                            : null;

                        if (matchedCountry) {
                            countryName = matchedCountry.name || countryName;
                            countryUrl = matchedCountry.urlName || countryUrl || toSlug(countryName);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    }

    const sidebarSections = buildCategorySidebarSections(sidebarData, {
        citySlug: citySlugPath,
        cityName
    });
    const seo = buildCitySeo({
        citySlug,
        resolvedSlugData: {
            ...resolvedSlugData
        },
        firstHotel,
        countryName,
        countrySlug: countryUrl
    });

    return (
        <>
            <HeroSection variant="common" />

            <section className="mobile-actions d-lg-none">
                <div className="container px-0">
                    <div className="mobile-actions__bottom">
                        <button className="mobile-actions__link">Sort</button>

                        <MobileFilterDrawer sidebarSections={sidebarSections} />

                        <MobileHotelMapButton label="Map" />
                    </div>
                </div>
            </section>
            {/* <div className="py-3">
                <div className="container">
                    <div className="breadcrumb-wrapper">
                        <nav aria-label="breadcrumb" className="mb-0"> */}
            <div className="py-3 mx-2">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <AppLink href="/destinations" className="text-dark text-decoration-none">
                                    All Countries
                                </AppLink>
                            </li>

                            {countryName && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <AppLink href={`/${toSlug(countryUrl)}`} className="text-dark text-decoration-none">
                                        {countryName}
                                    </AppLink>
                                </li>
                            )}

                            {regionName && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <AppLink href={`${toSlug(regionUrl)}`} className="text-dark text-decoration-none">
                                        {regionName}
                                    </AppLink>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px active">
                                <AppLink href={`/${citySlugPath}`} className="text-decoration-none">
                                    {cityName}
                                </AppLink>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* <section className="container py-2 mx-1"> */}
            <section className="py-4 p-1">
                <div className="container">
                    <SeoDetailsCard metaTitle={seo.metaTitle} metaDescription={seo.metaDescription} canonicalPath={seo.canonicalPath} />
                    {/* <h2 className="mb-3">Hotel Accommodation in {cityName}</h2> */}

                    <CityHotelListingWithMap
                        sidebarSections={sidebarSections}
                        hotels={hotels}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        pageCookieName={pageCookieName}
                        pageIntentCookieName={pageIntentCookieName}
                        citySlug={citySlug}
                        citySlugPath={citySlugPath}
                        countryId={resolvedCountryId}
                        content={content}
                    />
                </div>
            </section>
        </>
    );
}
