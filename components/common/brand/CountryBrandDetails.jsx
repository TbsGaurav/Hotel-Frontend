import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCountryBrandHotels } from '@/lib/api/public/brandapi';
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

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function CountryBrandDetails({ params, searchParams }) {
    const { slug: slugData } = await params;
    const resolvedSearchParams = await searchParams;
    const slug = slugData || [];

    if (!slug || slug.length < 2) {
        return null;
    }

    const countrySlug = slug[0];
    const brandSlug = decodeURIComponent(slug[1]);
    const countryName = capitalize(countrySlug);
    const brandName = brandSlug;
    const formattedBrand = formatBrand(brandName);
    const fullSlug = `/${countryName}/${brandName}`;
    const currentPage = parsePageNumber(resolvedSearchParams?.page);

    let hotels = [];
    let totalCount = 0;

    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const pageHotels = await getCountryBrandHotels(fullSlug, pageNumber, PAGE_SIZE);
            const nextHotels = pageHotels || [];

            if (!nextHotels.length) {
                break;
            }

            hotels = hotels.concat(nextHotels);
            totalCount = Math.max(totalCount, resolveTotalCount(nextHotels));
        }
    } catch (err) {
        console.error('Error initializing country brand details:', err);
    }

    const hasMore = hotels.length < totalCount || (hotels.length !== 0 && hotels.length % PAGE_SIZE === 0);

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

                        <span className="mx-2 text-muted">&bull;</span>

                        <Link href={`/${countryName}/${brandName}`} className=" text-decoration-none text-primary text-capitalize">
                            {countryName}
                        </Link>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {countryName}
                </h3>
                {hotels.length > 0 ? (
                    <CountryBrandHotelList
                        hotels={hotels}
                        brand={brandName}
                        currentPage={currentPage}
                        hasMore={hasMore}
                    />
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hotels available for this brand in {countryName}.</p>
                    </div>
                )}
            </section>
        </>
    );
}
