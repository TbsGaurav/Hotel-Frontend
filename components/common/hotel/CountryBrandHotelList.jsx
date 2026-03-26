'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';

export default function CountryBrandHotelList({ hotels = [], brand, hotelRates = [] }) {
    const defaultImage = '/image/property-img.webp';
    const [timestamp, setTimestamp] = useState('');
    const normalizedBrand = String(brand || '').replace(/^\/+|\/+$/g, '');

    useEffect(() => {
        setTimestamp(Date.now().toString());
    }, []);

    const handleImageError = (e) => {
        if (!e.target.src.includes(defaultImage)) {
            e.target.src = defaultImage;
        }
    };

    const getImageUrl = (photo) => {
        if (!photo) return defaultImage;
        const sep = photo.includes('?') ? '&' : '?';
        return timestamp ? `${photo}${sep}t=${timestamp}` : photo;
    };

    const getHotelRate = (bookingID) => hotelRates.find((rate) => rate.id === bookingID);

    const getRatingText = (score) => {
        const value = Number(score);

        if (!value) return 'Not rated';
        if (value >= 9) return 'Exceptional';
        if (value >= 8) return 'Excellent';
        if (value >= 7) return 'Very good';
        if (value >= 6) return 'Good';
        return 'Pleasant';
    };

    if (!hotels.length) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No hotels available.</p>
            </div>
        );
    }

    const groupedHotels = Object.values(
        hotels.reduce((acc, hotel) => {
            const key = hotel.cityName;

            if (!acc[key]) {
                acc[key] = {
                    cityName: hotel.cityName,
                    cityUrlName: hotel.cityUrlName,
                    hotels: []
                };
            }

            acc[key].hotels.push(hotel);
            return acc;
        }, {})
    );

    const getCityBrandPath = (cityUrlName) => {
        const normalizedCity = String(cityUrlName || '').replace(/^\/+|\/+$/g, '');
        return `/${normalizedCity}/${normalizedBrand}`;
    };

    const formattedBrand = brand.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <div className="container">
            <div className="d-flex flex-column gap-4">
                {groupedHotels.map((city) => (
                    <div key={city.cityName}>
                        <Link href={getCityBrandPath(city.cityUrlName)} className="text-decoration-none">
                            <h5 className="text-warning city-hover">
                                {formattedBrand} {city.cityName}
                            </h5>
                        </Link>

                        {city.hotels.map((hotel) => {
                            const rate = getHotelRate(hotel.bookingID);
                            const badges = rate?.badges || [];
                            const breakfastBadge = badges.find((badge) => badge.toLowerCase().includes('breakfast'));
                            const otherBadges = badges.filter((badge) => !badge.toLowerCase().includes('breakfast'));

                            return (
                                <div
                                    key={hotel.hotelId}
                                    className="card border-0 rounded-4 mb-4 p-4"
                                    style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.08)' }}
                                >
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <Link href={`${hotel.url}`} target="_blank" className="text-decoration-none">
                                                <div className="position-relative">
                                                    {breakfastBadge ? (
                                                        <span
                                                            className="position-absolute text-white px-3 py-1"
                                                            style={{
                                                                top: '12px',
                                                                left: '12px',
                                                                background: '#28a745',
                                                                borderRadius: '20px',
                                                                fontSize: '12px',
                                                                zIndex: 2
                                                            }}
                                                        >
                                                            {breakfastBadge}
                                                        </span>
                                                    ) : null}

                                                    <img
                                                        src={getImageUrl(hotel?.photo)}
                                                        className="d-block w-100 rounded-4"
                                                        style={{ height: '240px', objectFit: 'cover' }}
                                                        alt={hotel.hotelName}
                                                        onError={handleImageError}
                                                    />
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="col-md-8">
                                            <div
                                                className="text-decoration-none"
                                                onClick={() => (window.location.href = hotel.urlName)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <h4 className="property-grid-title font-size-18 my-auto me-3">{hotel.hotelName}</h4>

                                                        <div className="text-warning">
                                                            {[...Array(5)].map((_, i) => (
                                                                <MdOutlineStarPurple500
                                                                    key={i}
                                                                    size={18}
                                                                    color={i < hotel.stars ? '#f0831e' : '#ddd'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center">
                                                        <div className="rating-box d-flex me-2">
                                                            <span className="m-auto">
                                                                {hotel.reviewScore === 0 ? 'N/A' : hotel.reviewScore}
                                                            </span>
                                                        </div>

                                                        <div className="my-auto">
                                                            <p className="small-para-14-px font-weight-bold mb-1">
                                                                {hotel.ratingText || getRatingText(hotel.reviewScore)}
                                                            </p>

                                                            <p className="para-12px mb-0">
                                                                {hotel.reviewCount
                                                                    ? `${hotel.reviewCount.toLocaleString()} verified reviews`
                                                                    : '0 verified reviews'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center flex-wrap gap-1 mb-2">
                                                    {hotel.hotelFacilities && (
                                                        <>
                                                            {hotel.hotelFacilities
                                                                .split('|')
                                                                .slice(0, 5)
                                                                .map((facility, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="badge bg-light text-dark border me-1 mb-1"
                                                                        style={{ fontSize: '11px' }}
                                                                    >
                                                                        {facility.trim()}
                                                                    </span>
                                                                ))}

                                                            {hotel.hotelFacilities.split('|').length > 5 && (
                                                                <span className="rating" style={{ fontSize: '11px' }}>
                                                                    +{hotel.hotelFacilities.split('|').length - 5} more
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <p className="small-para-14-px text-black mb-2">
                                                    <i className="fa-solid fa-map me-1"></i>
                                                    {hotel.address || 'Address not available'}
                                                </p>

                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <div>
                                                        <p className="para text-primary mb-0">
                                                            <i className="fa-solid fa-circle-info me-2"></i>
                                                            Book Now Pay Later!
                                                        </p>

                                                        {otherBadges.length > 0 ? (
                                                            <div className="mb-2">
                                                                {otherBadges.map((badge, idx) => (
                                                                    <p key={idx} className="para-12px mb-1 text-theme-green">
                                                                        <span
                                                                            className="me-2 text-theme-green"
                                                                            style={{ fontSize: '13px' }}
                                                                        >
                                                                            <i className="fa-solid fa-check me-1"></i>
                                                                            {badge}
                                                                        </span>
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {rate?.price ? (
                                                        <div className="price-block p-1 rounded mb-3">
                                                            <p className="para-12px text-muted mb-1 text-end">1 night, 2 adults</p>
                                                            <div className="d-flex align-items-baseline text-end">
                                                                <span className="text-theme-orange fw-bold" style={{ fontSize: '28px' }}>
                                                                    {rate.price.book}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="row">
                                                    <div className="col-12 col-md-3 d-flex ms-auto">
                                                        <Link
                                                            className="theme-button-blue rounded-4 w-100 d-block text-center p-2"
                                                            href={`${hotel.url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            See Availability
                                                            <i className="fa-solid fa-arrow-right ms-2"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
