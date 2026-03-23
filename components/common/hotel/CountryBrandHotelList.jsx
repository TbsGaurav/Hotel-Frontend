'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function CountryBrandHotelList({ hotels = [] }) {
    const defaultImage = '/image/property-img.webp';
    const [timestamp, setTimestamp] = useState('');

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

    function getRatingText(score) {
        if (!score) return 'No reviews yet';
        if (score >= 9) return 'Exceptional';
        if (score >= 8) return 'Excellent';
        if (score >= 7) return 'Very good';
        if (score >= 6) return 'Good';
        if (score >= 5) return 'Pleasant';
        return 'Review score needed';
    }

    if (!hotels.length) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No hotels available.</p>
            </div>
        );
    }
    console.log(hotels);

    return (
        <div className="container">
            {hotels.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel.hotelId}
                            className="card border-0 rounded-4 mb-4 p-4"
                            style={{
                                boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div className="row g-3">
                                {/* Image */}
                                <div className="col-md-4">
                                    <div className="position-relative">
                                        {/* TAG */}
                                        <span
                                            className="position-absolute text-white px-3 py-1"
                                            style={{
                                                top: '12px',
                                                right: '12px',
                                                background: '#ff7a00',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                zIndex: 2
                                            }}
                                        >
                                            {hotel.hotelType || 'Apartment Hotel'}
                                        </span>
                                        <img
                                            src={getImageUrl(hotel?.photo)}
                                            className="d-block w-100 rounded-4"
                                            style={{ height: '240px', objectFit: 'cover' }}
                                            alt={hotel.hotelName}
                                            onError={handleImageError}
                                        />
                                    </div>
                                </div>

                                {/* Hotel Info */}
                                <div className="col-md-8">
                                    <div
                                        href={`${hotel.urlName}`}
                                        className="text-decoration-none"
                                        onClick={() => (window.location.href = hotel.urlName)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/* TITLE + STARS + RATING */}
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
                                                <h4 className="property-grid-title font-size-18 my-auto me-3 ">{hotel.hotelName}</h4>
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

                                            {/* RATING - moved to right side */}
                                            <div className="d-flex align-items-center">
                                                <div className="rating-box d-flex me-2">
                                                    <span className="m-auto">{hotel.reviewScore === 0 ? 'N/A' : hotel.reviewScore}</span>
                                                </div>

                                                <div className="my-auto">
                                                    <p className="small-para-14-px font-weight-bold mb-1">{hotel.ratingText}</p>

                                                    <p className="para-12px mb-0">
                                                        {hotel.reviewCount
                                                            ? `${hotel.reviewCount.toLocaleString()} verified reviews`
                                                            : '0 verified reviews'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FACILITIES */}
                                        {/* <div className="d-flex align-items-center flex-wrap gap-1 mb-2">
                                        <p className="small-para-14-px font-weight-bold my-auto me-2">Facilities:</p>

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
                                    </div> */}

                                        {/* ADDRESS */}
                                        <p className="small-para-14-px text-black mb-2">
                                            <i className="fa-solid fa-map me-1"></i>
                                            {hotel.address || 'Address not available'}
                                        </p>

                                        {/* DISTANCE */}
                                        {hotel.distanceFromAirport && (
                                            <p className="small-para-14-px text-black mb-3">
                                                <i className="fa-solid fa-plane-up me-1"></i>
                                                {hotel.distanceFromAirport}
                                            </p>
                                        )}

                                        {/* DESCRIPTION */}
                                        {hotel.description && (
                                            <p className="small-para-14-px text-black mb-3">
                                                {hotel.description.length > 200
                                                    ? `${hotel.description.slice(0, 200)}... `
                                                    : hotel.description}
                                                {hotel.description.length > 200 && <span className="rating">more</span>}
                                            </p>
                                        )}

                                        {/* PAYMENT OPTION */}
                                        <p className="para text-primary mb-1">
                                            <i className="fa-solid fa-circle-info me-2"></i>
                                            Book Now Pay Later!
                                        </p>

                                        <p className="para-12px mb-0 text-start text-theme-green">
                                            <i className="fa-solid fa-check me-1"></i>
                                            <b>Free Cancellation</b>
                                        </p>

                                        <p className="para-12px mb-1 text-start text-theme-green">
                                            <i className="fa-solid fa-check me-1"></i>
                                            No Payment Needed
                                        </p>

                                        {/* BUTTON */}
                                        <div className="row">
                                            <div className="col-12 col-md-3 d-flex ms-auto">
                                                <Link
                                                    className="theme-button-blue rounded w-100 d-block text-center p-2"
                                                    href={`${hotel.url}`}
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
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted">No hotels available in this collection yet.</p>
                </div>
            )}
        </div>
    );
}
