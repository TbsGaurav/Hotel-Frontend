import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getBrandHotels } from '@/lib/api/public/brandapi';

export default async function CountryBrandDetails({ params }) {
    const { slug } = params;

    const country = slug[0];
    const brand = decodeURIComponent(slug[1]);

    const fullSlug = `/${country}/${brand}`;

    const hotels = await getBrandHotels(fullSlug);

    return (
        <>
            <CountryHeroSection />

            <section className="container py-4">
                <h3 className="mb-4 text-capitalize">{decodedBrand?.replace(/-/g, ' ')} Hotels</h3>
                <HotelList hotels={hotels} />
                {/* {hotels.length > 0 ? (
                    <div className="d-flex flex-column gap-4">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.hotelId}
                                className="card border-0 rounded-4 p-3"
                                style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.08)' }}
                            >
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <img
                                            src={hotel.photo && hotel.photo.trim() !== '' ? hotel.photo : '/image/property-img.webp'}
                                            onError={(e) => {
                                                e.currentTarget.src = '/image/property-img.webp';
                                            }}
                                            className="w-100 rounded-4"
                                            style={{ height: '240px', objectFit: 'cover' }}
                                            alt={hotel.hotelName}
                                        />
                                    </div>

                                    <div className="col-md-8">
                                        <h5 className="fw-bold mb-2">{hotel.hotelName}</h5>

                                        <p className="text-muted mb-1">📍 {hotel.hotelAddress || 'Address not available'}</p>

                                        <p className="mb-2">
                                            ⭐ {hotel.stars} Stars | <strong>{hotel.reviewScore}</strong> ({hotel.reviewCount} reviews)
                                        </p>

                                        {hotel.hotelDescription && (
                                            <p className="small text-muted mb-2">
                                                {hotel.hotelDescription.length > 180
                                                    ? hotel.hotelDescription.slice(0, 180) + '...'
                                                    : hotel.hotelDescription}
                                            </p>
                                        )}

                                        {hotel.hotelFacilities && (
                                            <div className="mb-2">
                                                <strong>Facilities:</strong>{' '}
                                                {hotel.hotelFacilities
                                                    .split(',')
                                                    .slice(0, 5)
                                                    .map((f, i) => (
                                                        <span key={i} className="badge bg-light text-dark border me-1">
                                                            {f.trim()}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}

                                        <div className="d-flex gap-2 mt-3">
                                            <a
                                                href={hotel.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary btn-sm"
                                            >
                                                View Source
                                            </a>

                                            <a
                                                href={hotel.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                See Availability →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hotels found for this brand.</p>
                    </div>
                )} */}
            </section>
        </>
    );
}
