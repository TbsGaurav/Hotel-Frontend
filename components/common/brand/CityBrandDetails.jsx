import AppLink from '@/components/common/AppLink';
import { cookies } from 'next/headers';
import HeroSection from '@/components/sections/HeroSection';
import { getHotelList } from '@/lib/api/public/hotelapi';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { getSidebarData } from '@/lib/api/sidebarapi';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { buildBrandSeo } from '@/lib/seo';
import SeoDetailsCard from '@/components/common/SeoDetailsCard';
import CityBrandHotelListingWithMap from './CityBrandHotelListingWithMap';
import MobileHotelMapButton from '@/components/common/listing/MobileHotelMapButton';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function safeDecodeURIComponent(value = '') {
    try {
        return decodeURIComponent(value);
    } catch {
        return String(value || '');
    }
}

function formatCityName(slug = '') {
    return String(slug || '')
        .split('-')
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
        .filter(Boolean)
        .join(' ');
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

export default async function CityBrandDetails({ params, resolvedSlugData = {} }) {
    const { slug: slugData } = await params;
    const slug = slugData || [];

    if (!slug || slug.length < 2) {
        return null;
    }

    const citySlug = slug[0];
    const brandSegment = String(slug[1] ?? '');
    const decodedBrandSegment = safeDecodeURIComponent(brandSegment);
    const brandName = decodedBrandSegment;
    const cityName = formatCityName(citySlug) || capitalize(citySlug);
    const formattedBrand = formatBrand(decodedBrandSegment);
    const fullSlug = `${citySlug}/${decodedBrandSegment}`;

    const cookieStore = await cookies();
    const pageCookieName = getCityBrandPageCookieName(citySlug, decodedBrandSegment);
    const pageIntentCookieName = getCityBrandPageIntentCookieName(citySlug, decodedBrandSegment);
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);

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
    const seo = buildBrandSeo({
        parentSlug: citySlug,
        brandSlug: decodedBrandSegment,
        resolvedSlugData,
        pageType: 'citybrand'
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
                                <AppLink href="/brands" className="text-dark text-decoration-none">
                                    All Brands
                                </AppLink>
                            </li>

                            <li className="breadcrumb-item small-para-14-px">
                                <AppLink
                                    href={`/brand/${encodeURIComponent(decodedBrandSegment)}`}
                                    className="text-dark text-decoration-none text-capitalize"
                                >
                                    {formattedBrand}
                                </AppLink>
                            </li>

                            {countrySlug && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <AppLink
                                        href={`/${encodeURIComponent(countrySlug)}/${encodeURIComponent(decodedBrandSegment)}`}
                                        className="text-dark text-decoration-none text-capitalize"
                                    >
                                        {formattedBrand} {countrySlug}
                                    </AppLink>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px active text-capitalize">
                                <AppLink
                                    href={`/${encodeURIComponent(citySlug)}/${encodeURIComponent(decodedBrandSegment)}`}
                                    className="text-decoration-none"
                                >
                                    {formattedBrand} {cityName}
                                </AppLink>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="container py-2">
                <SeoDetailsCard metaTitle={seo.metaTitle} metaDescription={seo.metaDescription} canonicalPath={seo.canonicalPath} />
                {hotels.length > 0 ? (
                    <CityBrandHotelListingWithMap
                        sidebarSections={sidebarSections}
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
            </section>
        </>
    );
}
