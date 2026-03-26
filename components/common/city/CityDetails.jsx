import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityHotels } from '@/lib/api/public/cityapi';
import Link from 'next/link';
import CityHotelList from './CityHotelList';

function toSlug(value = '') {
    if (!value) return '';

    return value.toString().trim().toLowerCase().replace(/\s+/g, '-');
}

export default async function CityDetails({ params }) {
    const { slug } = await params;
    const citySlug = slug?.[0] || '';
    const hotels = citySlug ? await getCityHotels(citySlug) : [];
    const hasData = hotels && hotels.length > 0;
    const firstHotel = hasData ? hotels[0] : null;
    // const country = firstHotel?.countryName;
    // const region = firstHotel?.regionName;
    const city = firstHotel?.cityName;
    const content = firstHotel?.content;
    // const countrySlug = toSlug(country);
    // const regionSlug = toSlug(region);
    const citySlugPath = toSlug(city);

    return (
        <>
            <CountryHeroSection />

            {hasData && (
                <div className="py-2">
                    <div className="container">
                        <div className="d-flex align-items-center small">
                            <Link href="/destinations" className="text-dark text-decoration-none">
                                All Countries
                            </Link>

                            {/* <span className="mx-2 text-muted">•</span> */}

                            {/* <span className="mx-2">&bull;</span> */}

                            {/* <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                                {country}
                            </Link> */}

                            {/* <span className="mx-2">&bull;</span> */}

                            {/* <Link href={`/${countrySlug}/${regionSlug}`} className="text-dark text-decoration-none">
                                {region}
                            </Link> */}

                            <span className="mx-2">&bull;</span>

                            <Link className="text-primary" href={`/${citySlugPath}`}>
                                {city}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <section className="container py-5">
                {hasData ? (
                    <>
                        <h2 className="mb-3">Hotel Accommodation in {city}</h2>

                        {content && <div className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: content }} />}

                        <CityHotelList hotels={hotels} />
                    </>
                ) : (
                    <div className="text-center py-5">
                        <h4>No hotels found for this city</h4>
                    </div>
                )}
            </section>
        </>
    );
}
