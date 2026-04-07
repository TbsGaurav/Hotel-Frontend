import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getHotelList } from '@/lib/api/public/hotelapi';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { getSidebarData } from '@/lib/api/sidebarapi';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';
import CityHotelList from '../city/CityHotelList';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function toSlug(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}

function getCityBrandPageCookieName(citySlug = '', brandSlug = '') {
    const combined = `${toSlug(citySlug)}_${toSlug(brandSlug)}`;
    return `city_brand_page_${combined.replace(/[^a-z0-9_-]/g, '_')}`;
}

function getCityBrandPageIntentCookieName(citySlug = '', brandSlug = '') {
    const combined = `${toSlug(citySlug)}_${toSlug(brandSlug)}`;
    return `city_brand_page_intent_${combined.replace(/[^a-z0-9_-]/g, '_')}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

const PAGE_SIZE = 10;

export default async function CityBrandDetails({ params }) {
    const { slug: slugData } = await params;
    const slug = slugData || [];

    if (!slug || slug.length < 2) {
        return null;
    }

    const citySlug = slug[0];
    const brandSlug = decodeURIComponent(slug[1]);
    const brandName = brandSlug;
    const cityName = capitalize(citySlug);
    const formattedBrand = formatBrand(brandSlug);
    const fullSlug = `${citySlug}/${brandSlug}`;

    const cookieStore = await cookies();
    const pageCookieName = getCityBrandPageCookieName(citySlug, brandSlug);
    const pageIntentCookieName = getCityBrandPageIntentCookieName(citySlug, brandSlug);
    const hasPaginationIntent = Boolean(cookieStore.get(pageIntentCookieName)?.value);
    const currentPage = hasPaginationIntent ? parsePageNumber(cookieStore.get(pageCookieName)?.value) : 1;

    let hotels = [];
    let totalCount = 0;
    let sidebarData = {};

    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageResponse = await getHotelList(fullSlug, pageNumber, PAGE_SIZE);
            const nextHotels = pageResponse?.hotels || [];

            if (!nextHotels.length) {
                break;
            }

            if (pageNumber === 1) {
                totalCount = pageResponse?.totalCount || 0;

                // Extract cityId from API response
                const apiCityId = pageResponse?.cityId;
                if (apiCityId !== null && apiCityId !== undefined) {
                    sidebarData = await getSidebarData({ cityId: apiCityId });
                }
            }

            hotels = hotels.concat(nextHotels);
        }
    } catch (err) {
        console.error('Error initializing city brand details:', err);
    }

    const firstHotel = hotels?.[0] || {};
    const countryName = firstHotel.countryName || firstHotel.country || '';
    const countrySlug = firstHotel.countryUrlName || toSlug(countryName);
    const sidebarSections = buildSidebarSections(sidebarData, {
        contextName: cityName,
        propertyTypeHeader: cityName ? `${cityName} Apartments, Suites and Family Hotels` : 'Property Type'
    });

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
                                <Link href="/brands" className="text-dark text-decoration-none">
                                    All Brands
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px">
                                <Link href={`/brand/${brandName}`} className="text-dark text-decoration-none text-capitalize">
                                    {formattedBrand}
                                </Link>
                            </li>

                            {countrySlug && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <Link href={`/${countrySlug}/${brandName}`} className="text-dark text-decoration-none text-capitalize">
                                        {formattedBrand} {countrySlug}
                                    </Link>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px active text-capitalize">
                                <Link href={`/${toSlug(cityName)}/${toSlug(brandName)}`} className="text-decoration-none">
                                    {formattedBrand} {cityName}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            

            <section className="container py-2">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {cityName}
                </h3>
                <div className="row g-4 align-items-start">
                    <div className="col-lg-3 d-none d-lg-block order-lg-1">
                        {' '}
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>

                    {/* <div className="col-lg-9 order-1 order-lg-2"> */}
                    <div className="col-12 col-lg-9 order-1 order-lg-2">
                        {hotels.length > 0 ? (
                            <CityHotelList
                                hotels={hotels}
                                totalCount={totalCount}
                                currentPage={currentPage}
                                pageSize={PAGE_SIZE}
                                citySlug={fullSlug}
                                citySlugPath={fullSlug}
                                pageCookieName={pageCookieName}
                                pageIntentCookieName={pageIntentCookieName}
                            />
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">No hotels available for this brand in {cityName}.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
