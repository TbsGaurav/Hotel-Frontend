import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getHotelList } from '@/lib/api/public/hotelapi';
import { getCitySidebar } from '@/lib/api/public/cityapi';
import { getCountryByUrlName, resolveSlug } from '@/lib/api/public/countryapi';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { buildListingSidebarSections } from '@/lib/listingSidebar';
import CountryBrandHotelList from '../hotel/CountryBrandHotelList';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

const PAGE_SIZE = 10;

function resolveTotalCount(hotelsData = []) {
    const reportedTotal = hotelsData?.[0]?.totalCount;

    if (Number.isFinite(Number(reportedTotal)) && Number(reportedTotal) > 0) {
        return Number(reportedTotal);
    }

    return hotelsData.length;
}

function toSlug(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}

function getCountryBrandPageCookieName(countrySlug = '', brandSlug = '') {
    const combined = `${toSlug(countrySlug)}_${toSlug(brandSlug)}`;
    return `country_brand_page_${combined.replace(/[^a-z0-9_-]/g, '_')}`;
}

function getCountryBrandPageIntentCookieName(countrySlug = '', brandSlug = '') {
    const combined = `${toSlug(countrySlug)}_${toSlug(brandSlug)}`;
    return `country_brand_page_intent_${combined.replace(/[^a-z0-9_-]/g, '_')}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

export default async function CountryBrandDetails({ params }) {
    const { slug: slugData } = await params;
    const slug = slugData || [];

    if (!slug || slug.length < 2) {
        return null;
    }

    const countrySlug = slug[0];
    const brandSlug = decodeURIComponent(slug[1]);
    const brandName = brandSlug;
    const countryName = capitalize(countrySlug);
    const formattedBrand = formatBrand(brandSlug);
    const fullSlug = `${countrySlug}/${brandSlug}`;

    const cookieStore = await cookies();
    const pageCookieName = getCountryBrandPageCookieName(countrySlug, brandSlug);
    const pageIntentCookieName = getCountryBrandPageIntentCookieName(countrySlug, brandSlug);
    const hasPaginationIntent = Boolean(cookieStore.get(pageIntentCookieName)?.value);
    const currentPage = hasPaginationIntent ? parsePageNumber(cookieStore.get(pageCookieName)?.value) : 1;

    let hotels = [];
    let totalCount = 0;
    let sidebarData = {};
    let lastFetchedPageSize = 0;

    try {
        let countryId = null;

        const countryInfo = await getCountryByUrlName(countrySlug);
        countryId = getFirstDefined(countryInfo?.countryId, countryInfo?.countryId, countryInfo?.CountryId);

        if (!countryId) {
            const countrySlugInfo = await resolveSlug(`/${countrySlug}`);
            countryId = getFirstDefined(countrySlugInfo?.data?.countryId, countrySlugInfo?.data?.countryId, countrySlugInfo?.data?.entityId);
        }

        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageResponse = await getHotelList(fullSlug, pageNumber, PAGE_SIZE);
            const nextHotels = pageResponse?.hotels || [];

            if (!nextHotels.length) {
                break;
            }

            if (pageNumber === 1) {
                totalCount = pageResponse?.totalCount || 0;

                // Extract countryId from API response if not already resolved
                if (!countryId) {
                    countryId = pageResponse?.countryId;
                }
            }

            hotels = hotels.concat(nextHotels);
            lastFetchedPageSize = nextHotels.length;
        }

        if (countryId) {
            const sidebar = await getCitySidebar({ countryId });
            sidebarData = sidebar || {};
        }
    } catch (err) {
        console.error('Error initializing country brand details:', err);
    }

    const displayCountryName = getFirstDefined(hotels[0]?.countryName, hotels[0]?.CountryName) || countryName;
    const hasReliableTotalCount = Number.isFinite(Number(totalCount)) && Number(totalCount) > 0;
    const hasFullLastPage = lastFetchedPageSize === PAGE_SIZE;
    const hasMore = hasFullLastPage && (!hasReliableTotalCount || hotels.length < Number(totalCount));
    const sidebarSections = buildListingSidebarSections(sidebarData, displayCountryName);

    return (
        <>
            <CountryHeroSection />
            <section className="mobile-actions d-lg-none">
                <div className="container px-0">
                    <div className="mobile-actions__bottom">
                        <button type="button" className="mobile-actions__link">
                            Sort
                        </button>
                        <button type="button" className="mobile-actions__link">
                            Filter
                        </button>
                        <button type="button" className="mobile-actions__link">
                            Map
                        </button>
                    </div>
                </div>
            </section>
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/brands" className="text-dark text-decoration-none">
                            All Brands
                        </Link>

                        <span className="mx-2 text-muted">&bull;</span>

                        <Link href={`/brand/${brandName}`} className="text-dark text-decoration-none text-capitalize">
                            {formattedBrand}
                        </Link>

                        <span className="mx-2 text-muted">&bull;</span>

                        <Link href={`/${countrySlug}/${brandName}`} className=" text-decoration-none text-primary text-capitalize">
                            {countryName}
                        </Link>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {displayCountryName}
                </h3>
                <div className="row g-4 align-items-start">
                    <div className="col-lg-3 order-2 order-lg-1">
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>

                    <div className="col-lg-9 order-1 order-lg-2">
                        <div id="country-brand-hotel-list">
                            {hotels.length > 0 ? (
                                <CountryBrandHotelList
                                    hotels={hotels}
                                    brand={brandName}
                                    currentPage={currentPage}
                                    hasMore={hasMore}
                                    pageCookieName={pageCookieName}
                                    pageIntentCookieName={pageIntentCookieName}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted">No hotels available for this brand in {displayCountryName}.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
