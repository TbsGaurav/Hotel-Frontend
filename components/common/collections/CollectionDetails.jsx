'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';

export default function CollectionDetails({ collection, hotels }) {
    const basic = collection?.basicCollection;
    const content = collection?.collectionContent;
    const hotelsData = hotels || [];

    // Default image path
    const defaultImage = '/image/property-img.webp';
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimestamp(Date.now().toString());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleImageError = (e) => {
        // Only set default if not already showing default
        if (!e.target.src.includes(defaultImage)) {
            e.target.src = defaultImage;
        }
    };

    // Generate cache-busted URL
    const getImageUrl = (photo) => {
        if (!photo) return defaultImage;
        const sep = photo.includes('?') ? '&' : '?';
        return timestamp ? `${photo}${sep}t=${timestamp}` : photo;
    };

    function decodeHtml(html) {
        if (!html) return '';

        // Handle HTML entities without using document (SSR compatible)
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&apos;': "'",
            '&nbsp;': ' ',
            '&ndash;': '–',
            '&mdash;': '—',
            '&copy;': '©',
            '&reg;': '®',
            '&trade;': '™'
        };

        let decoded = html;
        Object.keys(entities).forEach((entity) => {
            decoded = decoded.replace(new RegExp(entity, 'g'), entities[entity]);
        });

        return decoded;
    }

    // Get rating text based on review score
    function getRatingText(score) {
        if (score === 0 || score === null || score === undefined) return 'No reviews yet';
        if (score >= 9) return 'Exceptional';
        if (score >= 8) return 'Excellent';
        if (score >= 7) return 'Very good';
        if (score >= 6) return 'Good';
        if (score >= 5) return 'Pleasant';
        return 'Review score needed';
    }

    return (
        <>
            <CountryHeroSection />

            {!collection ? (
                <div className="container py-5 text-center">
                    <h3>Collection not found</h3>
                    <Link href="/" className="theme-button-orange rounded-1 mt-3 d-inline-block">
                        Back to Home
                    </Link>
                </div>
            ) : (
                <>
                    {/* Breadcrumb - Similar to CountryIntro */}
                    <div className="py-2">
                        <div className="container">
                            <div className="d-flex align-items-center small">
                                <Link href="/" className="text-dark text-decoration-none">
                                    Home
                                </Link>
                                <span className="mx-2 text-muted">•</span>
                                <span className="fw-semibold text-decoration-none text-primary">{basic?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section - Similar styling to CountryHeroSection but simplified */}
                    <section className="container py-5">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <h2 className="display-5 fw-bold mb-3">{content?.header}</h2>

                                {content?.introShortCopy && (
                                    <div
                                        className="text-muted mb-3"
                                        dangerouslySetInnerHTML={{
                                            __html: decodeHtml(content?.introShortCopy)
                                        }}
                                    />
                                )}

                                <div className="d-flex flex-wrap gap-4 mt-3">
                                    <div className="d-flex align-items-center">
                                        <FaMapMarkerAlt className="text-muted me-2" />
                                        <span>{basic?.districtName || basic?.cityName || basic?.regionName || basic?.countryName}</span>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <FaHotel className="text-muted me-2" />
                                        <span>{hotelsData.length} Hotels</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content */}
                    <div className="container">
                        {/* Hotels Grid - Similar to property listings */}

                        {hotelsData.length > 0 ? (
                            <div className="d-flex flex-column gap-4">
                                {hotelsData.map((hotel) => (
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
                                                        style={{ height: '280px', objectFit: 'cover' }}
                                                        alt={hotel.hotelName}
                                                        onError={handleImageError}
                                                    />{' '}
                                                </div>
                                            </div>

                                            {/* Hotel Info */}
                                            <div className="col-md-8">
                                                {/* TITLE + STARS */}
                                                <div className="d-flex align-items-center mb-2">
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

                                                {/* FACILITIES */}
                                                <div className="d-flex align-items-center flex-wrap gap-1 mb-2">
                                                    <p className="small-para-14-px font-weight-bold my-auto me-2">Facilities:</p>

                                                    {hotel.hotelFacilities && (
                                                        <>
                                                            {hotel.hotelFacilities
                                                                .split(',')
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
                                                            {hotel.hotelFacilities.split(',').length > 5 && (
                                                                <span className="rating" style={{ fontSize: '11px' }}>
                                                                    +{hotel.hotelFacilities.split(',').length - 5} more
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {/* ADDRESS */}
                                                <p className="small-para-14-px text-black mb-2">
                                                    <i className="fa-solid fa-map me-1"></i>
                                                    {hotel.hotelAddress || 'Address not available'}
                                                </p>

                                                {/* DISTANCE */}
                                                {hotel.distanceFromAirport && (
                                                    <p className="small-para-14-px text-black mb-3">
                                                        <i className="fa-solid fa-plane-up me-1"></i>
                                                        {hotel.distanceFromAirport}
                                                    </p>
                                                )}

                                                {/* DESCRIPTION */}
                                                {hotel.hotelDescription && (
                                                    <p className="small-para-14-px text-black mb-3">
                                                        {hotel.hotelDescription.length > 200
                                                            ? `${hotel.hotelDescription.slice(0, 200)}... `
                                                            : hotel.hotelDescription}
                                                        {hotel.hotelDescription.length > 200 && <span className="rating">more</span>}
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

                                                <p className="para-12px mb-3 text-start text-theme-green">
                                                    <i className="fa-solid fa-check me-1"></i>
                                                    No Payment Needed
                                                </p>

                                                {/* RATING + BUTTON */}
                                                <div className="row">
                                                    <div className="col-12 col-md-6 d-flex mb-3 mb-md-0">
                                                        <div className="my-auto d-flex">
                                                            <div className="rating-box d-flex me-2">
                                                                <span className="m-auto">
                                                                    {hotel.reviewScore === 0 ? 'N/A' : hotel.reviewScore}
                                                                </span>
                                                            </div>

                                                            <div className="my-auto">
                                                                <p className="small-para-14-px font-weight-bold mb-1">
                                                                    {getRatingText(hotel.reviewScore)}
                                                                </p>

                                                                <p className="para-12px mb-0">
                                                                    {hotel.reviewCount
                                                                        ? `${hotel.reviewCount.toLocaleString()} verified reviews`
                                                                        : '0 verified reviews'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6 d-flex">
                                                        <Link
                                                            className="theme-button-blue rounded w-100 d-block text-center"
                                                            href={`${hotel.url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            See Availability
                                                            <i className="fa-solid fa-arrow-right ms-2"></i>
                                                        </Link>
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
                </>
            )}
        </>
    );
}

// Skeleton Loading Component
function CollectionDetailsSkeleton() {
    return (
        <div className="container py-5">
            {/* Breadcrumb / Title Skeleton */}
            <div className="mb-4">
                <div className="skeleton-text mb-2" style={{ width: '150px', height: '20px' }}></div>
                <div className="skeleton-title" style={{ width: '300px', height: '35px' }}></div>
                <div className="skeleton-text mt-2" style={{ width: '500px', height: '20px' }}></div>
            </div>

            {/* Hotels Grid Skeleton */}
            <div className="d-flex flex-column gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card border-0 rounded-4 mb-4 p-4" style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.08)' }}>
                        <div className="row g-3">
                            {/* Left: Image Skeleton */}
                            <div className="col-md-4">
                                <div className="skeleton-image rounded-4" style={{ height: '200px', width: '100%' }}></div>
                            </div>

                            {/* Middle: Info Skeleton */}
                            <div className="col-md-8">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="skeleton-title me-3" style={{ width: '60%', height: '24px' }}></div>
                                    <div className="d-flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <div
                                                key={j}
                                                className="skeleton-star"
                                                style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-2">
                                    <div className="skeleton-text me-2" style={{ width: '80px', height: '16px' }}></div>
                                    <div
                                        className="skeleton-image me-2"
                                        style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                                    ></div>
                                    <div
                                        className="skeleton-image me-2"
                                        style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                                    ></div>
                                    <div className="skeleton-image" style={{ width: '24px', height: '24px', borderRadius: '4px' }}></div>
                                </div>

                                <div className="skeleton-text mb-2" style={{ width: '100%', height: '16px' }}></div>
                                <div className="skeleton-text mb-2" style={{ width: '90%', height: '16px' }}></div>
                                <div className="skeleton-text mb-3" style={{ width: '70%', height: '16px' }}></div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div
                                                className="skeleton-image me-2"
                                                style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                                            ></div>
                                            <div>
                                                <div className="skeleton-text mb-1" style={{ width: '80px', height: '14px' }}></div>
                                                <div className="skeleton-text" style={{ width: '100px', height: '12px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className="skeleton-button"
                                            style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
