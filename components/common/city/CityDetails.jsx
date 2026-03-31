'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityHotels, getCitySidebar } from '@/lib/api/public/cityapi';
import { getHotelRates } from '@/lib/api/public/hotelapi';
import CityHotelList from './CityHotelList';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';

const PAGE_SIZE = 10;

function toSlug(value = '') {
    if (!value) return '';
 
    return value.toString().trim().toLowerCase().replace(/\s+/g, '-');
}
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

function extractCityHotels(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.hotels)) return payload.hotels;
    if (Array.isArray(payload?.hotelData)) return payload.hotelData;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
}

export default function CityDetails({ params, city: cityProp = null, cityId: resolvedCityId = null }) {
    const [citySlug, setCitySlug] = useState('');
    const [hotels, setHotels] = useState([]);
    const [hotelRates, setHotelRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [city, setCity] = useState('');
    const [content, setContent] = useState('');
    const [sidebar, setSidebar] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        const initializeCity = async () => {
            try {
                setLoading(true);
                setError(null);

                const resolvedParams = await Promise.resolve(params || {});
                const rawCitySlug = resolvedParams?.slug?.[0] || '';
                const normalizedSlug = normalizeCitySlug(rawCitySlug);
                setCitySlug(normalizedSlug);

                if (!normalizedSlug) {
                    if (isActive) {
                        setHotels([]);
                        setHotelRates([]);
                        setPage(1);
                        setHasMore(false);
                        setTotalCount(0);
                        setCity('');
                        setContent('');
                        setSidebar({});
                    }
                    return;
                }

                let hotelsData = [];
                let hotelRatesData = [];
                let cityValue = '';
                let contentValue = '';

                if (normalizedSlug) {
                    const data = await getCityHotels(normalizedSlug, 1, PAGE_SIZE);
                    hotelsData = extractCityHotels(data);

                    if (hotelsData && hotelsData.length > 0) {
                        const firstHotel = hotelsData[0];
                        cityValue = firstHotel?.cityName || firstHotel?.CityName || normalizedSlug;
                        contentValue = firstHotel?.content || '';

                        const bookingIds = hotelsData.map((hotel) => hotel.bookingID).filter(Boolean) || [];
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
                            hotelRatesData = ratesRes?.data || [];
                        }
                    }
                }

                if (!isActive) return;

                setHotels(hotelsData);
                setHotelRates(hotelRatesData);
                setCity(cityValue);
                setContent(contentValue);
                setTotalCount(hotelsData[0]?.totalCount || hotelsData.length);
                setHasMore(hotelsData.length < (hotelsData[0]?.totalCount || hotelsData.length));
                setPage(1);

                if (resolvedCityId && hotelsData.length > 0) {
                    const firstHotel = hotelsData[0];
                    const regionId = getFirstDefined(firstHotel?.regionId, firstHotel?.regionID, firstHotel?.RegionID);
                    const sidebarData = await getCitySidebar(resolvedCityId, regionId);
                    if (!isActive) return;
                    setSidebar(sidebarData || {});
                } else {
                    setSidebar({});
                }
            } catch (err) {
                console.error('Error initializing city details:', err);
                if (isActive) {
                    setError('Failed to load city details');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        initializeCity();

        return () => {
            isActive = false;
        };
    }, [params, cityProp, resolvedCityId]);

    const loadMoreHotels = async () => {
        if (loadingMore || !hasMore || !citySlug) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const response = await getCityHotels(citySlug, nextPage, PAGE_SIZE);
            const newHotels = extractCityHotels(response);

            if (newHotels && newHotels.length > 0) {
                const bookingIds = newHotels.map((hotel) => hotel.bookingID).filter(Boolean);
                let newRates = [];

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
                    newRates = ratesRes?.data || [];
                }

                setHotels((prev) => [...prev, ...newHotels]);
                setHotelRates((prev) => [...prev, ...newRates]);
                setPage(nextPage);

                const responseTotal = Number(newHotels[0]?.totalCount || totalCount || 0);
                const currentTotal = hotels.length + newHotels.length;
                setHasMore(currentTotal < responseTotal);
                setTotalCount(responseTotal || currentTotal);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more hotels:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    const hasData = hotels && hotels.length > 0;
    const citySlugPath = normalizeCitySlug(city || citySlug);
    const breadcrumbLabel = toTitleCase(city || citySlug || '');

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

    if (loading) {
        return (
            <>
                <CountryHeroSection />
                <section className="container py-5">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error) {
        return (
            <>
                <CountryHeroSection />
                <section className="container py-5">
                    <div className="text-center py-5">
                        <h4>{error}</h4>
                    </div>
                </section>
            </>
        );
    }

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
                            <Link className="text-primary text-decoration-none" href={`/${citySlugPath}`}>
                                {city}
                            </Link>
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
                                    <div className="text-muted small mb-3">
                                        Showing {hotels.length} of {totalCount || hotels.length} hotels
                                    </div>

                                    <CityHotelList hotels={hotels} hotelRates={hotelRates} />

                                    {hasMore && (
                                        <div className="text-center mt-4">
                                            <button
                                                type="button"
                                                onClick={loadMoreHotels}
                                                disabled={loadingMore}
                                                className="theme-button-orange rounded-1 px-5 py-2"
                                            >
                                                {loadingMore ? 'Loading...' : 'Load More'}
                                            </button>
                                        </div>
                                    )}
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
