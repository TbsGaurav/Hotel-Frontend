'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getHotelList, getHotelRates } from '@/lib/api/public/hotelapi';
import { getUserCurrency } from '@/lib/getUserCurrency';
import Image from 'next/image';
import HotelMapView from '@/components/common/listing/HotelMapView';
import HotelListToolbar from '@/components/common/listing/HotelListToolbar';

export default function CountryBrandHotelList({
    hotels = [],
    brand,
    countrySlug = '',
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
    const [viewMode, setViewMode] = useState('list');
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [allRates, setAllRates] = useState(hotelRates || []);
    const [allHotels, setAllHotels] = useState(hotels || []);
    const [page, setPage] = useState(currentPage || 1);
    const [localHasMore, setLocalHasMore] = useState(hasMore);
    const [failedImageKeys, setFailedImageKeys] = useState(() => new Set());
    const [isMapVisible, setIsMapVisible] = useState(false);
    const loadMoreTriggerRef = useRef(null);
    const normalizedCountrySlug = String(countrySlug || '').replace(/^\/+|\/+$/g, '');
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
        const handler = () => setIsMapVisible((prev) => !prev);
        window.addEventListener('hotel-map-toggle', handler);
        return () => window.removeEventListener('hotel-map-toggle', handler);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setTimestamp(Date.now().toString());
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const syncViewport = () => {
            setIsMobileViewport(window.innerWidth < 768);
        };

        syncViewport();
        window.addEventListener('resize', syncViewport);
        return () => window.removeEventListener('resize', syncViewport);
    }, []);

    useEffect(() => {
        if (isMobileViewport && viewMode !== 'list') {
            setViewMode('list');
        }
    }, [isMobileViewport, viewMode]);

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

    const handleImageError = (imageKey) => {
        setFailedImageKeys((prev) => {
            if (prev.has(imageKey)) return prev;
            const next = new Set(prev);
            next.add(imageKey);
            return next;
        });
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
        const rawKey = bookingId ?? hotel?.hotelId ?? hotel?.id ?? hotel?.urlName ?? hotel?.url;
        return rawKey ? `${rawKey}-${index}` : `hotel-${index}`;
    };

    const dedupeHotels = (list) => {
        const seen = new Set();
        const result = [];
        list.forEach((hotel) => {
            const id = hotel?.bookingId ?? hotel?.hotelId ?? hotel?.id;
            const key = id !== undefined && id !== null && id !== '' ? String(id) : null;
            if (key && seen.has(key)) return;
            if (key) seen.add(key);
            result.push(hotel);
        });
        return result;
    };

    const fetchMoreHotels = () => {
        if (!localHasMore || loadingMore) return;

        if (!normalizedCountrySlug || !normalizedBrand) {
            setLocalHasMore(false);
            return;
        }

        setLoadingMore(true);
        const nextPage = page + 1;
        const pageSize = 10;
        const countryBrandSlug = `${normalizedCountrySlug}/${normalizedBrand}`;

        getHotelList(countryBrandSlug, { pageNumber: nextPage, pageSize })
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

                if (pageIntentCookieName) {
                    document.cookie = `${pageIntentCookieName}=1; path=/; SameSite=Lax; Max-Age=20`;
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
                    fetchMoreHotels();
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

    const navigateToHotel = (url) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const effectiveViewMode = isMobileViewport ? 'list' : viewMode;
    const hotelsByViewMode =
        effectiveViewMode === 'grid' ? [{ cityName: 'all-hotels', cityUrlName: '', hotels: allHotels }] : groupedHotels;

    if (!allHotels.length) {
        return (
            <div className="container py-5">
                <div
                    className="mx-auto text-center rounded-4 shadow-sm border-0 overflow-hidden"
                    style={{
                        maxWidth: '760px',
                        background: 'linear-gradient(135deg, #fff7ef 0%, #ffffff 45%, #f4f8fc 100%)',
                        border: '1px solid rgba(240, 131, 30, 0.12)'
                    }}
                >
                    <div
                        style={{
                            padding: '32px 24px',
                            background:
                                'radial-gradient(circle at top, rgba(240, 131, 30, 0.16) 0%, rgba(240, 131, 30, 0.04) 28%, transparent 55%)'
                        }}
                    >
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: '72px',
                                height: '72px',
                                background: '#f0831e',
                                color: '#fff',
                                boxShadow: '0 12px 28px rgba(240, 131, 30, 0.28)'
                            }}
                        >
                            <FaHotel size={30} />
                        </div>

                        <h3 className="fw-bold mb-2" style={{ color: '#1d2b3a' }}>
                            No hotels found
                        </h3>
                        <p className="text-muted mb-4" style={{ maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                            We couldn’t find any hotels for this destination right now. Try changing your filters, checking nearby areas, or
                            searching again with different dates.
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-3" style={{ color: '#5f6b7a', fontSize: '14px' }}>
                            <div className="d-flex align-items-center gap-2">
                                <span
                                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                    style={{ width: '34px', height: '34px', background: '#fff1e3', color: '#f0831e' }}
                                >
                                    <FaHotel size={14} />
                                </span>
                                <span>Try a different destination</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="container">
            {!isMobileViewport ? (
                <HotelListToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    mapVisible={isMapVisible}
                    onMapToggle={() => setIsMapVisible(!isMapVisible)}
                    resultsCount={allHotels.length}
                />
            ) : null}

            {isMapVisible ? <HotelMapView hotels={allHotels} className="mb-4" /> : null}

            <div className={`${effectiveViewMode === 'grid' ? 'row g-3 grid-view' : 'd-flex flex-column gap-3'}`}>
                {hotelsByViewMode.map((city) => (
                    <div key={city.cityName} className="d-flex flex-column gap-3">
                        {effectiveViewMode !== 'grid' ? (
                            <Link href={getCityBrandPath(city.cityUrlName)} className="text-decoration-none">
                                <h5 className="text-warning city-hover">
                                    {formattedBrand} {city.cityName}
                                </h5>
                            </Link>
                        ) : null}

                        <div className={effectiveViewMode === 'grid' ? 'row g-3' : 'd-flex flex-column gap-3'}>
                            {city.hotels.map((hotel, hotelIndex) => {
                                const hotelKey = getHotelKey(hotel, hotelIndex);
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
                                    <div key={hotelKey} className={effectiveViewMode === 'grid' ? 'col-12 col-md-6' : ''}>
                                        <div
                                            className={`card border-0 rounded-4 hotel-list-card collection-hotel-card ${effectiveViewMode === 'grid' ? 'p-3 h-100' : 'p-3 p-md-4'}`}
                                            style={{
                                                boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                                                minHeight: effectiveViewMode === 'grid' && !isMobileViewport ? '620px' : undefined
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
                                                <div
                                                    className={`col-12 ${effectiveViewMode === 'grid' ? '' : 'col-md-4'} collection-hotel-image-col`}
                                                >
                                                    <div className="position-relative collection-hotel-image-wrap">
                                                        {imageBadges.length > 0 && (
                                                            <>
                                                                {imageBadges.map((badge, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className={
                                                                            isMobileViewport
                                                                                ? 'image-ribbon'
                                                                                : 'position-absolute text-white px-3 py-1'
                                                                        }
                                                                        style={
                                                                            isMobileViewport
                                                                                ? { top: `${10 + idx * 24}px` }
                                                                                : {
                                                                                      top: idx === 0 ? '12px' : `${12 + idx * 30}px`,
                                                                                      left: '12px',
                                                                                      background: '#28a745',
                                                                                      borderRadius: '20px',
                                                                                      fontSize: '12px',
                                                                                      zIndex: 2
                                                                                  }
                                                                        }
                                                                    >
                                                                        {badge}
                                                                    </span>
                                                                ))}
                                                            </>
                                                        )}

                                                        <Image
                                                            src={failedImageKeys.has(hotelKey) ? defaultImage : getImageUrl(hotel?.photo)}
                                                            unoptimized
                                                            width={400}
                                                            height={270}
                                                            className={`d-block w-100 rounded-4 collection-hotel-image ${effectiveViewMode === 'grid' ? 'h-auto' : ''}`}
                                                            alt={hotel.hotelName}
                                                            onError={() => handleImageError(hotelKey)}
                                                            priority
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className={`col-12 ${effectiveViewMode === 'grid' ? '' : 'col-md-8'} collection-hotel-content-col`}
                                                >
                                                    <div className="text-decoration-none">
                                                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-2 collection-hotel-header">
                                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 mb-md-0 collection-hotel-title-row">
                                                                <Link
                                                                    href={`${hotel.urlName}`}
                                                                    className="property-grid-title font-size-16 font-size-md-18 my-auto me-2 me-md-3 hotel-name-link"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
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

                                                            <div className="d-flex collection-hotel-review-row">
                                                                <div className="rating-box me-2 collection-hotel-rating-box border-radius">
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

                                                        <div className="d-flex align-items-center flex-nowrap mb-2 collection-hotel-facilities overflow">
                                                            {hotel.hotelFacilities && (
                                                                <>
                                                                    {hotel.hotelFacilities
                                                                        .split('|')
                                                                        .slice(0, 5)
                                                                        .map((facility, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="badge bg-light text-dark border me-1 mb-1 ellips"
                                                                                title={facility.trim()}
                                                                            >
                                                                                {facility.trim()}
                                                                            </span>
                                                                        ))}
                                                                    {hotel.hotelFacilities.split('|').length > 5 && (
                                                                        <span className="rating star-rating">
                                                                            +{hotel.hotelFacilities.split('|').length - 5} more
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {(hotel.hotelAddress || hotel.address) && (
                                                            <p className="small-para-14-px mb-2 hotel-address-link collection-hotel-address">
                                                                <FaMapMarkerAlt className="me-1 hotel-address-icon" />
                                                                {hotel.hotelAddress || hotel.address}
                                                            </p>
                                                        )}

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
                                                                    const formattedOriginal = formatOriginalPrice(
                                                                        rate.price.book,
                                                                        originalPrice
                                                                    );
                                                                    return (
                                                                        <div className="price-block p-1 rounded mb-3 ms-auto text-end collection-hotel-price-block">
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
                                                                            <p className="para-12px text-muted mb-1 text-end collection-hotel-price-caption">
                                                                                Includes taxes and charges
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>

                                                        <div
                                                            className="d-flex justify-content-end mt-3 collection-hotel-cta-row collection-hotel-cta-col"
                                                            style={effectiveViewMode === 'grid' ? { paddingTop: '6px' } : undefined}
                                                        >
                                                            <Link
                                                                className="theme-button-blue rounded-4 d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 hotel-availability-button button-new"
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
                                    </div>
                                );
                            })}
                        </div>
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
