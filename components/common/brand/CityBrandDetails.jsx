import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityBrandHotels } from '@/lib/api/public/brandapi';
import Link from 'next/link';
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

export default async function CityBrandDetails({ params }) {
    const { slug } = await params;

    const city = capitalize(slug[0]);
    const brand = decodeURIComponent(slug[1]);
    const fullSlug = `/${city}/${brand}`;

    const hotels = await getCityBrandHotels(fullSlug);
    const formattedBrand = formatBrand(brand);
    const firstHotel = hotels?.[0] || {};
    const countryName = firstHotel.countryName || firstHotel.country || '';
    const countrySlug = firstHotel.countryUrlName || toSlug(countryName);
    const cityName = firstHotel.cityName || city;

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

                        <Link href={`/brand/${brand}`} className="text-dark text-decoration-none text-capitalize">
                            {formattedBrand}
                        </Link>

                        {countrySlug ? (
                            <>
                                <span className="mx-2 text-muted">&bull;</span>

                                <Link href={`/${countrySlug}/${brand}`} className="text-decoration-none text-primary text-capitalize">
                                    {formattedBrand} {countrySlug}
                                </Link>
                            </>
                        ) : null}

                        <span className="mx-2 text-muted">&bull;</span>

                        <span className="text-primary text-capitalize">
                            {formattedBrand} {''}
                            {cityName}
                        </span>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {cityName}
                </h3>
                <CityHotelList hotels={hotels} brand={brand} />
            </section>
        </>
    );
}
