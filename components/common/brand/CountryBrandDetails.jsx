import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCountryBrandHotels } from '@/lib/api/public/brandapi';
import { getHotelRates } from '@/lib/api/public/hotelapi';
import CountryBrandHotelList from '../hotel/CountryBrandHotelList';
import Link from 'next/link';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

export default async function CountryBrandDetails({ params }) {
    const { slug } = await params;

    const country = capitalize(slug[0]);
    const brand = decodeURIComponent(slug[1]);
    const fullSlug = `/${country}/${brand}`;

    const hotels = await getCountryBrandHotels(fullSlug);
    let hotelRates = [];
    const bookingIds = hotels?.map((hotel) => hotel.bookingID).filter(Boolean);

    if (bookingIds.length > 0) {
        const ratesRes = await getHotelRates({
            bookingIds,
            currency: 'USD',
            rooms: 1,
            adults: 2,
            childs: 0,
            device: 'desktop',
            checkIn: null,
            checkOut: null
        });
        hotelRates = ratesRes?.data || [];
    }

    const formattedBrand = formatBrand(brand);

    return (
        <>
            <CountryHeroSection />
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/brands" className="text-dark text-decoration-none">
                            All Brands
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link href={`/brand/${brand}`} className="text-dark text-decoration-none text-capitalize">
                            {formattedBrand}
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link href={`/${country}/${brand}`} className=" text-decoration-none text-primary text-capitalize">
                            {country}
                        </Link>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {country}
                </h3>
                {/* 🔥 NEW: Cities List */}
                {/* {hotels.length > 0 && (
                    <div className="mb-4">
                        <h5 className="mb-3">
                            {formattedBrand} {country} Cities
                        </h5>

                        <div className="d-flex flex-wrap gap-2">
                            {hotels.map((city) => (
                                <Link key={city.cityID} href={`/${city.citySlug}/${brand}`} className="text-decoration-none text-primary">
                                    {formattedBrand} {city.cityName}
                                </Link>
                            ))}
                        </div>
                    </div>
                )} */}
                <CountryBrandHotelList hotels={hotels} brand={brand} hotelRates={hotelRates} />
            </section>
        </>
    );
}
