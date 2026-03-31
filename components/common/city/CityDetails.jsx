

import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import CityHotelList from './CityHotelList';
import { getCityHotels } from '@/lib/api/public/cityapi';
import { getHotelRates } from '@/lib/api/public/hotelapi';

function toSlug(value = '') {
    return value?.toString().trim().toLowerCase().replace(/\s+/g, '-') || '';
}

function formatCityName(slug = '') {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const PAGE_SIZE = 10;

export default async function CityDetails({ params }) {
    const { slug } = await params;
    const citySlug = slug?.[0] || '';

    const citySlugPath = toSlug(citySlug);
    const cityName = formatCityName(citySlug);

    let hotels = [];
    let hotelRates = [];
    let totalCount = 0;

    if (citySlug) {
        try {
            let allHotels = [];
            let pageNumber = 1;
            let hasMore = true;

            while (hasMore) {
                const pageData = await getCityHotels(citySlug, pageNumber, PAGE_SIZE);

                if (pageData?.length > 0) {
                    allHotels = allHotels.concat(pageData);

                    // Get totalCount from first request
                    if (pageNumber === 1) {
                        totalCount = pageData[0]?.totalCount || pageData.length;
                    }

                    // Check if we have all hotels
                    if (allHotels.length >= totalCount) {
                        hasMore = false;
                    } else {
                        pageNumber++;
                    }
                } else {
                    hasMore = false;
                }
            }

            hotels = allHotels;

            // Fetch rates for all hotels
            const bookingIds = hotels.map((h) => h.bookingID).filter(Boolean);

            if (bookingIds.length > 0) {
                const ratesRes = await getHotelRates({
                    bookingIds,
                    currency: 'USD',
                    rooms: 1,
                    adults: 2,
                    childs: 0,
                    device: 'desktop'
                });

                hotelRates = ratesRes?.data || [];
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    }

    const hasMoreInitial = false; 

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link className="text-primary" href={`/${citySlugPath}`}>
                            {cityName}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <section className="container py-5">
                <h2 className="mb-3">Hotel Accommodation in {cityName}</h2>

                <CityHotelList
                    hotels={hotels}
                    initialRates={hotelRates}
                    hasMoreInitial={hasMoreInitial}
                    totalCount={totalCount}
                />
            </section>
        </>
    );
}
