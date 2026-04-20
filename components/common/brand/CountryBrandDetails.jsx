import Link from 'next/link';
import { cookies } from 'next/headers';
import HeroSection from '@/components/sections/HeroSection';
import { getHotelList } from '@/lib/api/public/hotelapi';
import { getCountryByUrlName, resolveSlug } from '@/lib/api/public/countryapi';
import { getCitySidebar } from '@/lib/api/public/cityapi';
import { buildListingSidebarSections } from '@/lib/listingSidebar';
import CountryBrandHotelList from '../hotel/CountryBrandHotelList';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { buildBrandSeo } from '@/lib/seo';
import SeoDetailsCard from '@/components/common/SeoDetailsCard';
import MobileHotelMapButton from '@/components/common/listing/MobileHotelMapButton';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function safeDecodeURIComponent(value = '') {
    try {
        return decodeURIComponent(value);
    } catch {
        return String(value || '');
    }
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

export default async function CountryBrandDetails({ params, resolvedSlugData = {} }) {
    const { slug: slugData } = await params;
    const slug = slugData || [];

    if (!slug || slug.length < 2) {
        return null;
    }

    const countrySlug = slug[0];
    const brandSegment = String(slug[1] ?? '');
    const decodedBrandSegment = safeDecodeURIComponent(brandSegment);
    const brandName = decodedBrandSegment;
    const countryName = capitalize(countrySlug);
    const formattedBrand = formatBrand(decodedBrandSegment);
    const fullSlug = `${countrySlug}/${decodedBrandSegment}`;

    const cookieStore = await cookies();
    const pageCookieName = getCountryBrandPageCookieName(countrySlug, decodedBrandSegment);
    const pageIntentCookieName = getCountryBrandPageIntentCookieName(countrySlug, decodedBrandSegment);
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);

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
            countryId = getFirstDefined(
                countrySlugInfo?.data?.countryId,
                countrySlugInfo?.data?.countryId,
                countrySlugInfo?.data?.entityId
            );
        }

        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageResponse = await getHotelList(fullSlug, pageNumber, PAGE_SIZE);
            const nextHotels = pageResponse?.hotels || [];

            if (!nextHotels.length) {
                break;
            }

            if (pageNumber === 1) {
                totalCount = pageResponse?.totalCount || 0;

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
    const seo = buildBrandSeo({
        parentSlug: countrySlug,
        brandSlug: decodedBrandSegment,
        resolvedSlugData,
        pageType: 'countrybrand'
    });

    return (
        <>
            <HeroSection variant="common" />
            <section className="mobile-actions d-lg-none">
                <div className="container px-0">
                    <div className="mobile-actions__bottom">
                        <button type="button" className="mobile-actions__link">
                            Sort
                        </button>
                        <MobileFilterDrawer sidebarSections={sidebarSections} />
                        <MobileHotelMapButton label="Map" />
                    </div>
                </div>
            </section>
            <div className="py-2 py-lg-3 mx-2">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/brands" className="text-dark text-decoration-none">
                                    All Brands
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px">
                                <Link
                                    href={`/brand/${encodeURIComponent(decodedBrandSegment)}`}
                                    className="text-dark text-decoration-none text-capitalize"
                                >
                                    {formattedBrand}
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px active text-capitalize">
                                <Link
                                    href={`/${encodeURIComponent(countrySlug)}/${encodeURIComponent(decodedBrandSegment)}`}
                                    className="text-decoration-none"
                                >
                                    {displayCountryName}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="py-4 p-1">
                <div className="container">
                    <SeoDetailsCard metaTitle={seo.metaTitle} metaDescription={seo.metaDescription} canonicalPath={seo.canonicalPath} />
                    <div className="row g-0 g-lg-4 align-items-start">
                        <div className="col-12 order-1">
                            <div id="country-brand-hotel-list">
                                {hotels.length > 0 ? (
                                    <CountryBrandHotelList
                                        hotels={hotels}
                                        brand={decodedBrandSegment}
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
                </div>
            </section>
        </>
    );
}
