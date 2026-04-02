import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityBrandHotels } from '@/lib/api/public/brandapi';
import CityHotelList from '../city/CityHotelList';

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
    const cityName = capitalize(citySlug);
    const brandName = brandSlug;
    const formattedBrand = formatBrand(brandName);
    const fullSlug = `/${cityName}/${brandName}`;

    const cookieStore = await cookies();
    const pageCookieName = getCityBrandPageCookieName(citySlug, brandName);
    const pageIntentCookieName = getCityBrandPageIntentCookieName(citySlug, brandName);
    const hasPaginationIntent = Boolean(cookieStore.get(pageIntentCookieName)?.value);
    const currentPage = hasPaginationIntent ? parsePageNumber(cookieStore.get(pageCookieName)?.value) : 1;

    let hotels = [];
    let totalCount = 0;

    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageHotels = await getCityBrandHotels(fullSlug, pageNumber, PAGE_SIZE);
            const nextHotels = pageHotels || [];

            if (!nextHotels.length) {
                break;
            }

            hotels = hotels.concat(nextHotels);
        }

        totalCount = hotels[0]?.totalCount || hotels.length;
    } catch (err) {
        console.error('Error initializing city brand details:', err);
    }

    const firstHotel = hotels?.[0] || {};
    const countryName = firstHotel.countryName || firstHotel.country || '';
    const countrySlug = firstHotel.countryUrlName || toSlug(countryName);

    return (
        <>
            <CountryHeroSection />
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
                        {countrySlug && (
                            <>
                                <span className="mx-2 text-muted">&bull;</span>
                                <Link href={`/${countrySlug}/${brandName}`} className="text-dark text-decoration-none text-capitalize">
                                    {formattedBrand} {countrySlug}
                                </Link>
                            </>
                        )}
                        <span className="mx-2 text-muted">&bull;</span>
                        <span className="text-primary text-capitalize">
                            {formattedBrand} {cityName}
                        </span>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {cityName}
                </h3>

                {hotels.length > 0 ? (
                    <CityHotelList
                        hotels={hotels}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        citySlugPath={`${toSlug(cityName)}/${toSlug(brandName)}`}
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
