import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import CityHotelList from './CityHotelList';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { getHotelList } from '@/lib/api/public/hotelapi';
import { getCountriesApi } from '@/lib/api/public/countryapi';
import { getSidebarData } from '@/lib/api/sidebarapi';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { buildCategorySidebarSections } from '@/lib/api/public/cityCategoryapi';

// Utility functions
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

export default async function CityDetails({ params }) {
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

    if (citySlug) {
        try {
            for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
                const pageResponse = await getHotelList(citySlug, pageNumber, PAGE_SIZE);
                const nextHotels = pageResponse?.hotels || [];

                if (!nextHotels.length) {
                    break;
                }

                if (pageNumber === 1) {
                    totalCount = pageResponse?.totalCount || nextHotels.length;
                    content = nextHotels[0]?.content || '';

                    // Extract IDs from API response (not from first hotel)
                    const apiCityId = pageResponse?.cityId;
                    if (apiCityId !== null && apiCityId !== undefined) {
                        sidebarData = await getSidebarData({ cityId: apiCityId });
                    }
                }

                hotels = hotels.concat(nextHotels);
            }

            if (hotels.length > 0) {
                const firstHotel = hotels[0];
                countryName = firstHotel?.countryName || firstHotel?.country || '';
                countryUrl = firstHotel?.countryUrlName || firstHotel?.countryUrl || toSlug(countryName);

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

    return (
        <>
            <CountryHeroSection />

            <section className="mobile-actions d-lg-none">
                <div className="container px-0">
                    <div className="mobile-actions__bottom">
                        <button className="mobile-actions__link">Sort</button>

                        <MobileFilterDrawer sidebarSections={sidebarSections} />

                        <button className="mobile-actions__link">Map</button>
                    </div>
                </div>
            </section>
            {/* <div className="py-3">
                <div className="container">
                    <div className="breadcrumb-wrapper">
                        <nav aria-label="breadcrumb" className="mb-0"> */}
            <div className="py-3">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/destinations" className="text-dark text-decoration-none">
                                    All Countries
                                </Link>
                            </li>

                            {countryName && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <Link href={`/${toSlug(countryUrl)}`} className="text-dark text-decoration-none">
                                        {countryName}
                                    </Link>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px active">
                                <Link href={`/${citySlugPath}`} className="text-decoration-none">
                                    {cityName}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="container py-2 ">
                {/* <h2 className="mb-3">Hotel Accommodation in {cityName}</h2> */}

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
                            pageSize={PAGE_SIZE}
                            pageCookieName={pageCookieName}
                            pageIntentCookieName={pageIntentCookieName}
                            citySlug={citySlug}
                            citySlugPath={citySlugPath}
                            content={content}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
