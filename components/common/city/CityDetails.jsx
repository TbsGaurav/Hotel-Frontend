import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityHotels, getCitySidebar } from '@/lib/api/public/cityapi';
import { getHotelRates } from '@/lib/api/public/hotelapi';
import CityHotelList from './CityHotelList';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';

function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

function normalizeCitySlug(value = '') {
    return String(value || '').replace(/^\/+|\/+$/g, '').replace(/\.htm$/i, '');
}

function toTitleCase(value = '') {
    return String(value || '')
        .replace(/[-_]+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeItems(items) {
    return Array.isArray(items) ? items : [];
}

export default async function CityDetails({ params, cityId: resolvedCityId = null }) {
    const { slug } = await params;
    const rawCitySlug = slug?.[0] || '';
    const citySlug = normalizeCitySlug(rawCitySlug);
    const cityHotels = rawCitySlug ? await getCityHotels(rawCitySlug) : [];
    const hasData = cityHotels && cityHotels.length > 0;
    const firstHotel = hasData ? cityHotels[0] : null;

    const cityName = getFirstDefined(firstHotel?.cityName, firstHotel?.CityName, citySlug);
    const content = firstHotel?.content;

    const cityId = resolvedCityId;
    const regionId = getFirstDefined(firstHotel?.regionId, firstHotel?.regionID, firstHotel?.RegionID);
    const sidebar = cityId ? await getCitySidebar(cityId, regionId) : {};

    let hotelRates = [];
    const bookingIds = cityHotels?.map((hotel) => hotel.bookingID).filter(Boolean) || [];

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

    const breadcrumbLabel = toTitleCase(cityName || citySlug || '');
    const sidebarSections = [
        {
            title: 'Rating',
            items: normalizeItems(sidebar?.rating || sidebar?.ratings || sidebar?.ratingItems),
            maxVisible: 6
        },
        {
            title: 'Property Type',
            items: normalizeItems(sidebar?.propertyTypes || sidebar?.propertyType || sidebar?.propertyTypeItems),
            maxVisible: 5
        },
        {
            title: 'Facilities',
            items: normalizeItems(sidebar?.hotelFacilities || sidebar?.facilities || sidebar?.facilityItems),
            maxVisible: 5
        }
    ];

    return (
        <>
            <CountryHeroSection />

            {hasData && (
                <div className="py-2">
                    <div className="container">
                        <div className="d-flex align-items-center small flex-wrap gap-1">
                            <Link href="/destinations" className="text-dark text-decoration-none">
                                All Countries
                            </Link>
                            <span className="mx-1 text-muted">&rsaquo;</span>
                            <span className="text-primary">{breadcrumbLabel}</span>
                            
                        </div>
                    </div>
                </div>
            )}

            <section className="container py-4">
                {hasData ? (
                    <>
                        <div className="bg-white border rounded-1 p-4 mb-3">
                            <h2 className="mb-0" style={{ fontWeight: 700 }}>
                                Hotel {breadcrumbLabel}
                            </h2>
                        </div>

                        {content && (
                            <div
                                className="bg-white border rounded-1 p-4 mb-4 text-muted"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )}

                        <div className="bg-white border rounded-1 p-3 mb-4 d-flex flex-wrap gap-3">
                            <button type="button" className="btn btn-link text-decoration-none fw-semibold text-dark px-0">
                                Hotel List
                            </button>
                            <button type="button" className="btn btn-link text-decoration-none fw-semibold text-dark px-0">
                                Hotel Map
                            </button>
                        </div>

                        <div className="row g-4 align-items-start">
                            <div className="col-lg-3">
                                <div className="position-sticky" style={{ top: '16px' }}>
                                    <ListingSidebar title="Filters" sections={sidebarSections} />
                                </div>
                            </div>

                            <div className="col-lg-9">
                                <div className="bg-white border rounded-1 p-4">
                                    <CityHotelList hotels={cityHotels} hotelRates={hotelRates} />
                                </div>
                            </div>
                        </div>
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