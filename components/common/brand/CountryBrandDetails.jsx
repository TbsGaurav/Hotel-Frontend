'use client';

import { useState, useEffect } from 'react';
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

const PAGE_SIZE = 10;

export default function CountryBrandDetails({ params }) {
    const [slug, setSlug] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [hotelRates, setHotelRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [country, setCountry] = useState('');
    const [brand, setBrand] = useState('');

    // Parse params and fetch initial data
    useEffect(() => {
        const initializeData = async () => {
            try {
                const { slug: slugData } = await params;
                setSlug(slugData);

                if (slugData && slugData.length >= 2) {
                    const countryName = capitalize(slugData[0]);
                    const brandName = decodeURIComponent(slugData[1]);
                    const fullSlug = `/${countryName}/${brandName}`;

                    setCountry(countryName);
                    setBrand(brandName);

                    // Fetch initial hotels
                    const hotelsData = await getCountryBrandHotels(fullSlug, 1, PAGE_SIZE);

                    if (hotelsData && hotelsData.length > 0) {
                        const total = hotelsData[0].totalCount || hotelsData.length;
                        setHotels(hotelsData);
                        setTotalCount(total);
                        setHasMore(hotelsData.length < total);

                        // Fetch rates for initial hotels
                        const bookingIds = hotelsData.map((hotel) => hotel.bookingID).filter(Boolean);
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
                            setHotelRates(ratesRes?.data || []);
                        }
                    }
                    setPage(1);
                }
            } catch (err) {
                console.error('Error initializing country brand details:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [params]);

    const loadMoreHotels = async () => {
        if (loadingMore || !hasMore || !slug || slug.length < 2) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const countryName = capitalize(slug[0]);
            const brandName = decodeURIComponent(slug[1]);
            const fullSlug = `/${countryName}/${brandName}`;

            const newHotels = await getCountryBrandHotels(fullSlug, nextPage, PAGE_SIZE);

            if (newHotels && newHotels.length > 0) {
                // Fetch rates for new hotels
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

                // Update hasMore based on total count
                const currentTotal = hotels.length + newHotels.length;
                setHasMore(currentTotal < totalCount);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more hotels:', err);
        } finally {
            setLoadingMore(false);
        }
    };

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
                {hotels.length > 0 ? (
                    <>
                        <CountryBrandHotelList hotels={hotels} brand={brand} hotelRates={hotelRates} />
                        {hasMore && (
                            <div className="text-center mt-4">
                                <button onClick={loadMoreHotels} disabled={loadingMore} className="theme-button-orange rounded-1 px-5 py-2">
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hotels available for this brand in {country}.</p>
                    </div>
                )}
            </section>
        </>
    );
}
