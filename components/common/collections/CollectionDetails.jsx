'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import { countryToCurrency } from '@/lib/utils';

export default function CollectionDetails({ collection, hotels, hotelRates, totalCount, currentPage, pageSize, collectionId }) {
    const basic = collection?.basicCollection;
    const content = collection?.collectionContent;

    // Pagination state
    const [loading, setLoading] = useState(false);
    const [allHotels, setAllHotels] = useState(hotels || []);
    const [allRates, setAllRates] = useState(hotelRates || []);
    const [page, setPage] = useState(currentPage || 1);
    const [hasMore, setHasMore] = useState((hotels?.length || 0) < (totalCount || 0));

    // Helper function to get rate for a hotel by bookingId
    const getHotelRate = (bookingId) => {
        return allRates.find(rate => rate.id === bookingId);
    };

    // Helper to format original price with currency
    const formatOriginalPrice = (currentPriceStr, originalPrice) => {
        if (!currentPriceStr || !originalPrice) return null;

        // Extract currency prefix (e.g., "AUD$", "USD$")
        const match = currentPriceStr.match(/^([A-Z]+\$)/);
        if (match) {
            const currency = match[1];
            const formattedNum = originalPrice.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            return `${currency}${formattedNum}`;
        }
        return `$${originalPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    };

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

    // Load more hotels handler
    const loadMoreHotels = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const hotelsRes = await getHotelsByCollection(collectionId, nextPage, pageSize);
            // Handle new API response structure: data.hotelData and data.totalCount
            const newHotels = hotelsRes?.data?.hotelData || hotelsRes?.data || [];

            if (newHotels.length > 0) {
                const countryCode = newHotels[0]?.countryCode;
                const currency = countryCode ? countryToCurrency(countryCode) : 'USD';

                const bookingIds = newHotels.map(hotel => hotel.bookingId).filter(Boolean);

                let newRates = [];
                if (bookingIds.length > 0) {
                    const ratesPayload = {
                        bookingIds: bookingIds,
                        currency: currency,
                        rooms: 1,
                        adults: 2,
                        childs: 0,
                        device: 'desktop',
                        checkIn: null,
                        checkOut: null
                    };
                    const ratesRes = await getHotelRates(ratesPayload);
                    newRates = ratesRes?.data || [];
                }

                setAllHotels(prev => [...prev, ...newHotels]);
                setAllRates(prev => [...prev, ...newRates]);
                setPage(nextPage);
                // Calculate if there are more hotels to load using current allHotels length
                const currentTotal = allHotels.length + newHotels.length;
                setHasMore(currentTotal < totalCount);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more hotels:', error);
        } finally {
            setLoading(false);
        }
    };

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
                                        <span>{allHotels.length} Hotels</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="container">
                        {allHotels.length > 0 ? (
                            <div className="d-flex flex-column gap-4">
                                {allHotels.map((hotel) => (
                                    <div
                                        key={hotel.hotelId}
                                        className="card border-0 rounded-4 mb-4 p-4"
                                        style={{
                                            boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <Link href={`${hotel.url}`} target="_blank" className="text-decoration-none">
                                                    <div className="position-relative">
                                                        {(() => {
                                                            const rate = getHotelRate(hotel.bookingId);
                                                            const badges = rate?.badges || [];
                                                            // Image badge: show badges that are NOT free cancellation or pay at property
                                                            const imageBadges = badges.filter(b =>
                                                                !b.toLowerCase().includes('free cancellation') &&
                                                                !b.toLowerCase().includes('pay at')
                                                            );
                                                            if (imageBadges.length > 0) {
                                                                return (
                                                                    <>
                                                                        {imageBadges.map((badge, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="position-absolute text-white px-3 py-1"
                                                                                style={{
                                                                                    top: idx === 0 ? '12px' : `${12 + (idx * 30)}px`,
                                                                                    left: '12px',
                                                                                    background: '#28a745',
                                                                                    borderRadius: '20px',
                                                                                    fontSize: '12px',
                                                                                    zIndex: 2
                                                                                }}
                                                                            >
                                                                                {badge}
                                                                            </span>
                                                                        ))}
                                                                    </>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                        <img
                                                            src={getImageUrl(hotel?.photo)}
                                                            className="d-block w-100 rounded-4"
                                                            style={{ height: '290px', objectFit: 'cover' }}
                                                            alt={hotel.hotelName}
                                                            onError={handleImageError}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="col-md-8">
                                                <div
                                                    className="text-decoration-none"
                                                    onClick={() => window.location.href = hotel.urlName}
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
                                                                    {hotel.ratingText}
                                                                </p>

                                                                <p className="para-12px mb-0">
                                                                    {hotel.reviewCount
                                                                        ? `${hotel.reviewCount.toLocaleString()} verified reviews`
                                                                        : '0 verified reviews'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center flex-wrap gap-1 mb-2" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                                                        {hotel.hotelFacilities && (
                                                            <>
                                                                {hotel.hotelFacilities
                                                                    .split('|')
                                                                    .slice(0, 5)
                                                                    .map((facility, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="badge bg-light text-dark border me-1 mb-1"
                                                                            style={{
                                                                                fontSize: '11px',
                                                                                whiteSpace: 'nowrap',
                                                                                maxWidth: '150px',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                display: 'inline-block'
                                                                            }}
                                                                            title={facility.trim()}
                                                                        >
                                                                            {facility.trim()}
                                                                        </span>
                                                                    ))}
                                                                {hotel.hotelFacilities.split('|').length > 5 && (
                                                                    <Link href={`${hotel.urlName}`} className="rating" style={{ fontSize: '11px' }}>
                                                                        +{hotel.hotelFacilities.split('|').length - 5} more
                                                                    </Link>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <p className="small-para-14-px text-black mb-2">
                                                        <FaMapMarkerAlt className="me-1 text-muted" />
                                                        {hotel.hotelAddress || 'Address not available'}
                                                    </p>

                                                    {hotel.distanceFromAirport && (
                                                        <p className="small-para-14-px text-black mb-3">
                                                            <i className="fa-solid fa-plane-up me-1"></i>
                                                            {hotel.distanceFromAirport}
                                                        </p>
                                                    )}

                                                    {/* DESCRIPTION */}
                                                    {/* {hotel.hotelDescription && (
                                                        <p className="small-para-14-px text-black mb-3">
                                                            {hotel.hotelDescription.length > 200
                                                                ? `${hotel.hotelDescription.slice(0, 200)}... `
                                                                : hotel.hotelDescription}
                                                            {hotel.hotelDescription.length > 200 && (
                                                                <span className="rating">
                                                                    more
                                                                </span>
                                                            )}
                                                        </p>
                                                    )} */}

                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                        <div>
                                                            <p className="para text-primary mb-0">
                                                                <i className="fa-solid fa-circle-info me-2"></i>
                                                                Book Now Pay Later!
                                                            </p>

                                                            {(() => {
                                                                const rate = getHotelRate(hotel.bookingId);
                                                                const badges = rate?.badges || [];

                                                                const infoBadges = badges.filter(b =>
                                                                    b.toLowerCase().includes('free cancellation') ||
                                                                    b.toLowerCase().includes('pay at')
                                                                );
                                                                if (infoBadges.length > 0) {
                                                                    return (
                                                                        <div className="mb-2">
                                                                            {infoBadges.map((badge, idx) => (
                                                                                <p key={idx} className="para-12px mb-1 text-theme-green">
                                                                                    <span
                                                                                        className="me-2 text-theme-green"
                                                                                        style={{ fontSize: '13px' }}
                                                                                    >
                                                                                        ✔ {badge}
                                                                                    </span>
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>

                                                        {(() => {
                                                            const rate = getHotelRate(hotel.bookingId);
                                                            if (rate?.price) {
                                                                const dealInfo = rate?.deal_info || {};
                                                                const originalPrice = dealInfo?.public_price;
                                                                const discountPercentage = dealInfo?.discount_percentage;
                                                                const formattedOriginal = formatOriginalPrice(rate.price.book, originalPrice);

                                                                return (
                                                                    <div className="price-block p-1 rounded mb-3">
                                                                        <p className="para-12px text-muted mb-1 text-end">
                                                                            1 night, 2 adults
                                                                        </p>
                                                                        {/* {discountPercentage > 0 && (
                                                                            <div className="text-end mb-1">
                                                                                <span className="badge bg-danger" style={{ fontSize: '11px' }}>
                                                                                    {discountPercentage}% OFF
                                                                                </span>
                                                                            </div>
                                                                        )} */}
                                                                        {formattedOriginal && originalPrice > rate.price.total && (
                                                                            <p className="para-12px text-muted mb-0 text-end" style={{ color: '#ee310f', textDecoration: 'line-through' }}>
                                                                                {formattedOriginal}
                                                                            </p>
                                                                        )}
                                                                        <div className="d-flex align-items-baseline text-end">
                                                                            <span className="text-theme-orange fw-bold" style={{ fontSize: '28px' }}>
                                                                                {rate.price.book}
                                                                            </span>
                                                                        </div>
                                                                        {/* <p className="para-12px text-muted mb-0">
                                                                            + {rate.price.total} taxes and charges
                                                                        </p> */}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
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
                                ))}

                                {hasMore && (
                                    <div className="text-center py-4">
                                        <button
                                            className="theme-button-orange rounded-1 px-5 py-2"
                                            onClick={loadMoreHotels}
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading...' : 'Load More'}
                                        </button>
                                    </div>
                                )}
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
