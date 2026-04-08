'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getHotelList, getHotelRates } from '@/lib/api/public/hotelapi';
import { getUserCurrency } from '@/lib/getUserCurrency';

export default function CountryBrandHotelList({
    hotels = [],
    brand,
    hotelRates = [],
    currentPage = 1,
    hasMore = false,
    pageCookieName = '',
    pageIntentCookieName = ''
}) {
    const defaultImage = '/image/property-img.webp';
    const [loadingMore, setLoadingMore] = useState(false);
    const [timestamp, setTimestamp] = useState('');
    const [currency, setCurrency] = useState(null);
    const [allRates, setAllRates] = useState(hotelRates || []);
    const [allHotels, setAllHotels] = useState(hotels || []);
    const [page, setPage] = useState(currentPage || 1);
    const [localHasMore, setLocalHasMore] = useState(hasMore);
    const loadMoreTriggerRef = useRef(null);
    const normalizedBrand = String(brand || '').replace(/^\/+|\/+$/g, '');

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setAllHotels(hotels || []);
            setPage(currentPage || 1);
            setLocalHasMore(hasMore);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [hotels, currentPage, hasMore]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setTimestamp(Date.now().toString());
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function initCurrency() {
            const cur = await getUserCurrency();
            setCurrency(cur);
        }

        initCurrency();
    }, []);

    const getBookingId = (hotel) => hotel?.bookingId ?? null;

    const fetchRatesForHotels = async (hotelsToRate, selectedCurrency) => {
        const bookingIds = hotelsToRate.map(getBookingId).filter(Boolean);

        if (!bookingIds.length || !selectedCurrency) {
            return [];
        }

        const ratesPayload = {
            bookingIds,
            currency: selectedCurrency,
            rooms: 1,
            adults: 2,
            childs: 0,
            device: 'desktop',
            checkIn: null,
            checkOut: null
        };

        const ratesRes = await getHotelRates(ratesPayload);
        return ratesRes?.data || [];
    };

    useEffect(() => {
        if (!currency || !allHotels.length) return;

        let cancelled = false;

        async function syncRates() {
            try {
                const refreshedRates = await fetchRatesForHotels(allHotels, currency);

                if (!cancelled) {
                    setAllRates(refreshedRates);
                }
            } catch (error) {
                console.error('Error refreshing hotel rates:', error);
            }
        }

        syncRates();

        return () => {
            cancelled = true;
        };
    }, [currency, allHotels]);

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

    const getHotelRate = (bookingId) => allRates.find((rate) => String(rate?.id) === String(bookingId));

    const getRatingText = (score) => {
        const value = Number(score);

        if (!value) return 'Not rated';
        if (value >= 9) return 'Exceptional';
        if (value >= 8) return 'Excellent';
        if (value >= 7) return 'Very good';
        if (value >= 6) return 'Good';
        return 'Pleasant';
    };

    const getHotelKey = (hotel, index) => {
        const bookingId = hotel?.bookingId;
        const rawKey = bookingId ?? hotel?.hotelId ?? hotel?.hotelID ?? hotel?.id ?? hotel?.urlName ?? hotel?.url;
        return rawKey ? `${rawKey}-${index}` : `hotel-${index}`;
    };

    const dedupeHotels = (list) => {
        const seen = new Set();
        const result = [];
        list.forEach((hotel) => {
            const id = hotel?.bookingId ?? hotel?.hotelId ?? hotel?.hotelID ?? hotel?.id;
            const key = id !== undefined && id !== null && id !== '' ? String(id) : null;
            if (key && seen.has(key)) return;
            if (key) seen.add(key);
            result.push(hotel);
        });
        return result;
    };

    const loadMoreHotels = () => {
        if (!localHasMore || loadingMore || !pageCookieName || !pageIntentCookieName) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        document.cookie = `${pageCookieName}=${nextPage}; path=/; SameSite=Lax`;
        document.cookie = `${pageIntentCookieName}=1; path=/; SameSite=Lax; Max-Age=20`;
        window.location.reload();
    };

    const getCountryBrandSlug = () => {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
            return `${pathParts[0]}/${pathParts[1]}`;
        }
        return null;
    };

    const fetchMoreHotels = () => {
        if (!localHasMore || loadingMore) return;

        const brandSlug = getCountryBrandSlug();
        if (!brandSlug) {
            setLocalHasMore(false);
            return;
        }

        setLoadingMore(true);
        const nextPage = page + 1;
        const pageSize = 10;

        getHotelList(brandSlug, nextPage, pageSize)
            .then((response) => {
                const nextHotels = response?.hotels || [];
                if (!nextHotels.length) {
                    setLocalHasMore(false);
                    return;
                }

                setAllHotels((prev) => dedupeHotels([...prev, ...nextHotels]));
                setPage(nextPage);
                setLocalHasMore(nextHotels.length === pageSize);

                if (pageCookieName) {
                    document.cookie = `${pageCookieName}=${nextPage}; path=/; SameSite=Lax`;
                }
            })
            .catch((error) => {
                console.error('Error loading more hotels:', error);
            })
            .finally(() => {
                setLoadingMore(false);
            });
    };

    useEffect(() => {
        if (!localHasMore || loadingMore || !loadMoreTriggerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (pageIntentCookieName) {
                        loadMoreHotels();
                    } else {
                        fetchMoreHotels();
                    }
                }
            },
            { rootMargin: '300px 0px' }
        );

        observer.observe(loadMoreTriggerRef.current);

        return () => observer.disconnect();
    }, [localHasMore, loadingMore, page, pageCookieName, pageIntentCookieName]);

    if (!allHotels.length) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No hotels available.</p>
            </div>
        );
    }

    const groupedHotels = Object.values(
        allHotels.reduce((acc, hotel) => {
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
        return `/${encodeURIComponent(normalizedCity)}/${encodeURIComponent(normalizedBrand)}`;
    };

    const formattedBrand = brand.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    const formatOriginalPrice = (currentPriceStr, originalPrice) => {
        if (!currentPriceStr || !originalPrice) return null;

        const match = currentPriceStr.match(/^[^\d-]+/u);
        if (match) {
            const currency = match[0].trim();
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

    const openMap = (lat, lng) => {
        if (!lat || !lng) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    };

    const navigateToHotel = (url) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="container">
            <div className="d-flex flex-column gap-3">
                {groupedHotels.map((city) => (
                    <div key={city.cityName} className="d-flex flex-column gap-3">
                        <Link href={getCityBrandPath(city.cityUrlName)} className="text-decoration-none">
                            <h5 className="text-warning city-hover">
                                {formattedBrand} {city.cityName}
                            </h5>
                        </Link>

                        {city.hotels.map((hotel) => {
                            const rate = getHotelRate(getBookingId(hotel));
                            const badges = rate?.badges || [];
                            const imageBadges = badges.filter(
                                (badge) => !badge.toLowerCase().includes('free cancellation') && !badge.toLowerCase().includes('pay at')
                            );
                            const infoBadges = badges.filter(
                                (badge) => badge.toLowerCase().includes('free cancellation') || badge.toLowerCase().includes('pay at')
                            );
                            const facilities = hotel.hotelFacilities
                                ? hotel.hotelFacilities
                                      .split('|')
                                      .map((facility) => facility.trim())
                                      .filter(Boolean)
                                : [];

                            return (
                                <div
                                    key={hotel.hotelId}
                                    className="card border-0 rounded-4 p-3 p-md-4 hotel-list-card collection-hotel-card"
                                    style={{
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
                                    }}
                                    onClick={() => navigateToHotel(hotel.url)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            navigateToHotel(hotel.url);
                                        }
                                    }}
                                    role="link"
                                    tabIndex={0}
                                >
                                    <div className="row g-3 collection-hotel-card-row">
                                        <div className="col-12 col-md-4 collection-hotel-image-col">
                                            <div className="position-relative collection-hotel-image-wrap">
                                                {imageBadges.length > 0 && (
                                                    <>
                                                        {imageBadges.map((badge, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="position-absolute text-white px-3 py-1"
                                                                style={{
                                                                    top: idx === 0 ? '12px' : `${12 + idx * 30}px`,
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
                                                )}
                                                <img
                                                    src={getImageUrl(hotel?.photo)}
                                                    className="d-block w-100 rounded-4 collection-hotel-image"
                                                    style={{ height: '270px', objectFit: 'cover' }}
                                                    alt={hotel.hotelName}
                                                    onError={handleImageError}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-8 collection-hotel-content-col">
                                            <div className="text-decoration-none">
                                                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-2 collection-hotel-header">
                                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 mb-md-0 collection-hotel-title-row">
                                                        <Link
                                                            href={`${hotel.urlName}`}
                                                            className="property-grid-title font-size-16 font-size-md-18 my-auto me-2 me-md-3 hotel-name-link"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {hotel.hotelName}
                                                        </Link>
                                                        <div className="text-warning mt-1 mt-md-0 collection-hotel-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <MdOutlineStarPurple500
                                                                    key={i}
                                                                    size={16}
                                                                    color={i < hotel.stars ? '#f0831e' : '#ddd'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center collection-hotel-review-row">
                                                        <div className="rating-box d-flex me-2 collection-hotel-rating-box">
                                                            <span className="m-auto">
                                                                {hotel.reviewScore === 0 ? 'N/A' : hotel.reviewScore}
                                                            </span>
                                                        </div>

                                                        <div className="my-auto collection-hotel-review-copy">
                                                            <p className="small-para-14-px font-weight-bold mb-1 collection-hotel-rating-text">
                                                                {hotel.ratingText || getRatingText(hotel.reviewScore)}
                                                            </p>

                                                            <p className="para-12px mb-0 collection-hotel-review-count">
                                                                {hotel.reviewCount
                                                                    ? `${hotel.reviewCount.toLocaleString('en-US')} verified reviews`
                                                                    : '0 verified reviews'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="d-flex align-items-center flex-nowrap mb-2 collection-hotel-facilities"
                                                    style={{ overflow: 'hidden', columnGap: '4px', whiteSpace: 'nowrap' }}
                                                >
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
                                                                            lineHeight: '1.2',
                                                                            whiteSpace: 'nowrap',
                                                                            maxWidth: '135px',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            display: 'inline-block',
                                                                            padding: '4px 8px'
                                                                        }}
                                                                        title={facility.trim()}
                                                                    >
                                                                        {facility.trim()}
                                                                    </span>
                                                                ))}
                                                            {hotel.hotelFacilities.split('|').length > 5 && (
                                                                <span className="rating" style={{ fontSize: '11px', lineHeight: '1.2' }}>
                                                                    +{hotel.hotelFacilities.split('|').length - 5} more
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <p
                                                    className="small-para-14-px mb-2 hotel-address-link collection-hotel-address"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openMap(hotel.latitude, hotel.longitude);
                                                    }}
                                                >
                                                    <FaMapMarkerAlt className="me-1 hotel-address-icon" />
                                                    {hotel.hotelAddress || hotel.address || 'Address not available'}
                                                </p>

                                                {hotel.distanceFromAirport && (
                                                    <p className="small-para-14-px text-black mb-3">
                                                        <i className="fa-solid fa-plane-up me-1"></i>
                                                        {hotel.distanceFromAirport}
                                                    </p>
                                                )}

                                                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-2 collection-hotel-meta-row">
                                                    <div className="mb-2 mb-md-0 collection-hotel-meta-copy">
                                                        <p className="para text-primary mb-0 collection-hotel-pay-later">
                                                            <i className="fa-solid fa-circle-info me-2"></i>
                                                            Book Now Pay Later!
                                                        </p>

                                                        {infoBadges.length > 0 ? (
                                                            <div className="mb-2 collection-hotel-badges">
                                                                {infoBadges.map((badge, idx) => (
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

                                                    {(() => {
                                                        const rate = getHotelRate(getBookingId(hotel));
                                                        if (rate?.price) {
                                                            const dealInfo = rate?.deal_info || {};
                                                            const originalPrice = dealInfo?.public_price;
                                                            const discountPercentage = dealInfo?.discount_percentage;
                                                            const formattedOriginal = formatOriginalPrice(rate.price.book, originalPrice);
                                                            return (
                                                                <div className="price-block p-1 rounded mb-3 collection-hotel-price-block">
                                                                    <p className="para-12px text-muted mb-1 text-end collection-hotel-price-caption">
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
                                                                        <p
                                                                            className="para-12px mb-0 text-end collection-hotel-original-price"
                                                                            style={{ color: 'red', textDecoration: 'line-through' }}
                                                                        >
                                                                            {formattedOriginal}
                                                                        </p>
                                                                    )}
                                                                    <div className="d-flex align-items-baseline justify-content-end collection-hotel-current-price-row">
                                                                        <span
                                                                            className="text-theme-orange fw-bold collection-hotel-current-price"
                                                                            style={{ fontSize: '24px' }}
                                                                        >
                                                                            {rate.price.book}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>

                                                <div className="d-flex justify-content-end mt-3 collection-hotel-cta-row collection-hotel-cta-col">
                                                    <Link
                                                        className="theme-button-blue rounded-4 d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 hotel-availability-button"
                                                        href={`${hotel.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span>See Availability</span>
                                                        <i className="fa-solid fa-arrow-right ms-2"></i>
                                                    </Link>
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
            {localHasMore && (
                <div ref={loadMoreTriggerRef} className="text-center py-4">
                    <p className="text-muted mb-0">{loadingMore ? 'Loading more...' : 'Loading more...'}</p>
                </div>
            )}
        </div>
    );
}
