'use client';

import { useState, useEffect, useRef } from 'react';
import AppLink from '@/components/common/AppLink';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import HeroSection from '@/components/sections/HeroSection';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import { getUserCurrency } from '@/lib/getUserCurrency';
import Image from 'next/image';
import HotelMapView from '@/components/common/listing/HotelMapView';
import HotelListToolbar from '@/components/common/listing/HotelListToolbar';

export default function CollectionDetails({ collection, hotels, hotelRates, totalCount, currentPage, pageSize, collectionId }) {
    const basic = collection?.basicCollection;
    const content = collection?.collectionContent;
    const [isHotelMapVisible, setIsHotelMapVisible] = useState(false);

    useEffect(() => {
        const handler = () => setIsHotelMapVisible((prev) => !prev);
        window.addEventListener('hotel-map-toggle', handler);
        return () => window.removeEventListener('hotel-map-toggle', handler);
    }, []);

    function getBookingId(hotel) {
        return hotel?.bookingId ?? hotel?.BookingId ?? null;
    }

    function getHotelIdentity(hotel) {
        return String(getBookingId(hotel) ?? hotel?.hotelId ?? hotel?.urlName ?? hotel?.url ?? hotel?.hotelName ?? '');
    }

    function mergeUniqueHotels(existingHotels = [], incomingHotels = []) {
        const seen = new Set();

        return [...existingHotels, ...incomingHotels].filter((hotel) => {
            const identity = getHotelIdentity(hotel);

            if (!identity) return true;
            if (seen.has(identity)) return false;

            seen.add(identity);
            return true;
        });
    }

    const getFirstDefined = (...values) => {
        for (const value of values) {
            if (value !== undefined && value !== null && value !== '') return value;
        }
        return null;
    };
    // Pagination state
    const [loading, setLoading] = useState(false);
    const [allHotels, setAllHotels] = useState(() => mergeUniqueHotels([], hotels || []));
    const [allRates, setAllRates] = useState(hotelRates || []);
    const [page, setPage] = useState(currentPage || 1);
    const [hasMore, setHasMore] = useState((hotels?.length || 0) < (totalCount || 0));
    const [currency, setCurrency] = useState(null);
    const [failedImageKeys, setFailedImageKeys] = useState(() => new Set());
    const loadMoreTriggerRef = useRef(null);
    const loadRequestInFlightRef = useRef(false);
    const pageRef = useRef(currentPage || 1);
    const [timestamp, setTimestamp] = useState('');

    const [viewMode, setViewMode] = useState('list');
    const [isMobileViewport, setIsMobileViewport] = useState(false);

    const navigateToHotel = (url) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        async function initCurrency() {
            const cur = await getUserCurrency();
            setCurrency(cur);
        }

        initCurrency();
    }, []);

    useEffect(() => {
        const handler = (event) => {
            const nextCurrency = event?.detail?.currency;
            if (nextCurrency) {
                setCurrency(nextCurrency);
            }
        };

        window.addEventListener('currencychange', handler);
        return () => window.removeEventListener('currencychange', handler);
    }, []);

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
    }, [currency]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    // Helper function to get rate for a hotel by bookingId
    const getHotelRate = (bookingId) => {
        return allRates.find((rate) => String(rate?.id) === String(bookingId));
    };

    // Helper to format original price with currency
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

    // Default image path
    const defaultImage = '/image/property-img.webp';

    const getHotelKey = (hotel, index) => {
        const bookingId = getBookingId(hotel);
        const rawKey = getFirstDefined(bookingId, hotel?.hotelId, hotel?.id, hotel?.urlName, hotel?.url);

        return rawKey ? `${rawKey}-${index}` : `hotel-${index}`;
    };

    const handleImageError = (imageKey) => {
        setFailedImageKeys((prev) => {
            if (prev.has(imageKey)) return prev;
            const next = new Set(prev);
            next.add(imageKey);
            return next;
        });
    };

    const normalizeImageUrl = (photo) => {
        if (typeof photo !== 'string') return defaultImage;

        const trimmed = photo.trim();
        const normalized = trimmed.toLowerCase();
        if (!trimmed || normalized === 'null' || normalized === 'undefined') return defaultImage;
        if (trimmed.startsWith('//')) return `https:${trimmed}`;
        if (trimmed.startsWith('/')) return trimmed;
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return defaultImage;
    };

    const getImageUrl = (photo) => {
        return normalizeImageUrl(photo);
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

    const getRatingText = (score) => {
        const value = Number(score);
        if (!value) return 'Not rated';
        if (value >= 9) return 'Exceptional';
        if (value >= 8) return 'Excellent';
        if (value >= 7) return 'Very good';
        if (value >= 6) return 'Good';
        return 'Pleasant';
    };

    // Load more hotels handler
    const loadMoreHotels = async () => {
        if (loadRequestInFlightRef.current || !hasMore) return;

        loadRequestInFlightRef.current = true;
        setLoading(true);
        const nextPage = pageRef.current + 1;

        try {
            const hotelsRes = await getHotelsByCollection(collectionId, nextPage, pageSize);
            const { hotels: newHotels } = hotelsRes;
            if (newHotels.length > 0) {
                const uniqueNewHotels = mergeUniqueHotels([], newHotels);
                let newRates = [];
                if (currency) {
                    newRates = await fetchRatesForHotels(uniqueNewHotels, currency);
                }

                setAllHotels((prev) => mergeUniqueHotels(prev, uniqueNewHotels));
                setAllRates((prev) => [...prev, ...newRates]);
                pageRef.current = nextPage;
                setPage(nextPage);
                setHasMore((prevHasMore) => {
                    if (!prevHasMore) return false;
                    const currentTotal = mergeUniqueHotels(allHotels, uniqueNewHotels).length;
                    return currentTotal < totalCount && uniqueNewHotels.length > 0;
                });
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more hotels:', error);
        } finally {
            loadRequestInFlightRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasMore || loading || !loadMoreTriggerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreHotels();
                }
            },
            { rootMargin: '300px 0px' }
        );

        observer.observe(loadMoreTriggerRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, page, collectionId, pageSize, currency, totalCount, allHotels.length]);
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

    const CountryName = Array.isArray(basic) && basic.length > 0 ? basic[0].countryName : basic?.countryName;
    const RegionName = Array.isArray(basic) && basic.length > 0 ? basic[0].regionName : basic?.regionName;
    const CollectionName = Array.isArray(basic) && basic.length > 0 ? basic[0].name : basic?.name;

    const CountryUrl = Array.isArray(basic) && basic.length > 0 ? basic[0].countryUrl : basic?.countryUrl;
    const RegionUrl = Array.isArray(basic) && basic.length > 0 ? basic[0].regionUrl : basic?.regionUrl;
    const CollectionUrl = Array.isArray(basic) && basic.length > 0 ? basic[0].slug : basic?.slug;
    const slugParts = CollectionUrl?.replace(/^\/+/, '').split('/').filter(Boolean) || [];
    const hasCity = slugParts.length > 1;

    const slugCity = hasCity ? slugParts[0] : null;
    const formattedCity = slugCity
        ? slugCity
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
        : null;
    const effectiveViewMode = isMobileViewport ? 'list' : viewMode;

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
        <>
            <HeroSection variant="common" />

            {!collection ? (
                <div className="container py-5 text-center">
                    <h3>Collection not found</h3>
                    <AppLink href="/" className="theme-button-orange rounded-1 mt-3 d-inline-block">
                        Back to Home
                    </AppLink>
                </div>
            ) : (
                <>
                    <div className="py-3 mx-2">
                        <div className="container">
                            <nav aria-label="breadcrumb" className="mb-0">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item small-para-14-px">
                                        <AppLink href="/" className="text-dark text-decoration-none">
                                            Home
                                        </AppLink>
                                    </li>
                                    {!hasCity ? (
                                        <li className="breadcrumb-item small-para-14-px active">
                                            <AppLink href={`/${CollectionUrl?.replace(/^\//, '')}`} className="text-decoration-none">
                                                {CollectionName}
                                            </AppLink>
                                        </li>
                                    ) : (
                                        <>
                                            {CountryName && (
                                                <li className="breadcrumb-item small-para-14-px">
                                                    <AppLink
                                                        href={`/${CountryUrl?.replace(/^\//, '')}`}
                                                        className="text-dark text-decoration-none"
                                                    >
                                                        {CountryName}
                                                    </AppLink>
                                                </li>
                                            )}
                                            {RegionName && (
                                                <li className="breadcrumb-item small-para-14-px">
                                                    <AppLink
                                                        href={`/${RegionUrl?.replace(/^\//, '')}`}
                                                        className="text-dark text-decoration-none"
                                                    >
                                                        {RegionName}
                                                    </AppLink>
                                                </li>
                                            )}
                                            <li className="breadcrumb-item small-para-14-px">
                                                <AppLink href={`/${slugCity}`} className="text-dark text-decoration-none">
                                                    {formattedCity}
                                                </AppLink>
                                            </li>
                                            <li className="breadcrumb-item small-para-14-px active">
                                                <AppLink href={`/${CollectionUrl?.replace(/^\//, '')}`} className="text-decoration-none">
                                                    {CollectionName}
                                                </AppLink>
                                            </li>
                                        </>
                                    )}
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <section className="py-4 p-2">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-12 col-lg-8">
                                    <h2 className="fs-2 fs-lg-1 fw-bold mb-3">{content?.header}</h2>

                                    {content?.introShortCopy && (
                                        <div
                                            className="text-muted mb-3"
                                            dangerouslySetInnerHTML={{
                                                __html: decodeHtml(content?.introShortCopy)
                                            }}
                                        />
                                    )}

                                    <div className="d-flex flex-wrap gap-3 gap-lg-4 mt-3">
                                        <div className="d-flex align-items-center">
                                            <FaMapMarkerAlt className="text-muted me-2" />
                                            <span>
                                                {Array.isArray(basic) && basic.length > 0
                                                    ? basic
                                                          .map((item) => item.cityName || item.regionName || item.countryName)
                                                          .filter(Boolean)
                                                          .join(', ')
                                                    : basic?.cityName || basic?.districtName || basic?.regionName || basic?.countryName}
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <FaHotel className="text-muted me-2" />
                                            <span>{allHotels.length} Hotels</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-4 p-1">
                        <div className="container px-2 ">
                            {allHotels.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {!isMobileViewport ? (
                                        <HotelListToolbar
                                            viewMode={viewMode}
                                            onViewModeChange={setViewMode}
                                            mapVisible={isHotelMapVisible}
                                            onMapToggle={() => setIsHotelMapVisible(!isHotelMapVisible)}
                                            resultsCount={allHotels.length}
                                        />
                                    ) : null}

                                    {isHotelMapVisible ? <HotelMapView hotels={allHotels} className="mb-2" /> : null}

                                    <div className={`${effectiveViewMode === 'grid' ? 'row g-3 grid-view' : 'd-flex flex-column gap-3'}`}>
                                        {allHotels.map((hotel, index) => {
                                            const hotelKey = getHotelKey(hotel, index);
                                     

                                            return (
                                                <div key={hotelKey} className={effectiveViewMode === 'grid' ? 'col-12 col-md-6' : ''}>
                                                    <div
                                                        className={`card border-0 rounded-4 hotel-list-card collection-hotel-card ${effectiveViewMode === 'grid' ? 'p-3 h-100' : 'p-3 p-md-4'}`}
                                                        style={{
                                                            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                                                            minHeight:
                                                                effectiveViewMode === 'grid' && !isMobileViewport ? '620px' : undefined
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
                                                        <div className="row g-3 collection-hotel-card-row  ">
                                                            <div
                                                                className={`col-12 ${effectiveViewMode === 'grid' ? '' : 'col-md-4'} collection-hotel-image-col`}
                                                            >
                                                                <div
                                                                    className="position-relative collection-hotel-image-wrap rounded-4 overflow-hidden"
                                                                    style={{
                                                                        backgroundImage: `url(${defaultImage})`,
                                                                        backgroundSize: 'cover',
                                                                        backgroundPosition: 'center'
                                                                    }}
                                                                >
                                                                    {(() => {
                                                                        const rate = getHotelRate(getBookingId(hotel));
                                                                        const badges = rate?.badges || [];
                                                                        const imageBadges = badges.filter(
                                                                            (b) =>
                                                                                !b.toLowerCase().includes('free cancellation') &&
                                                                                !b.toLowerCase().includes('pay at')
                                                                        );
                                                                        if (imageBadges.length > 0) {
                                                                            return (
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
                                                                                                          top:
                                                                                                              idx === 0
                                                                                                                  ? '12px'
                                                                                                                  : `${12 + idx * 30}px`,
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
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                    <Image
                                                                        src={
                                                                            failedImageKeys.has(hotelKey)
                                                                                ? defaultImage
                                                                                : getImageUrl(hotel?.photo)
                                                                        }
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
                                                                        <div className="d-flex flex-wrap align-items-center mb-2 mb-md-0 collection-hotel-title-row">
                                                                            <AppLink
                                                                                href={`${hotel.urlName}`}
                                                                                className="font-size-16 font-size-md-18 my-auto me-2 me-md-3 hotel-name-link collection-hotel-title"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                                                            >
                                                                                {hotel.hotelName}
                                                                            </AppLink>
                                                                            <div className="text-warning collection-hotel-stars">
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

                                                                            {(() => {
                                                                                const rate = getHotelRate(getBookingId(hotel));
                                                                                const badges = rate?.badges || [];

                                                                                const infoBadges = badges.filter(
                                                                                    (b) =>
                                                                                        b.toLowerCase().includes('free cancellation') ||
                                                                                        b.toLowerCase().includes('pay at')
                                                                                );
                                                                                if (infoBadges.length > 0) {
                                                                                    return (
                                                                                        <div className="mb-2 collection-hotel-badges">
                                                                                            {infoBadges.map((badge, idx) => (
                                                                                                <p
                                                                                                    key={idx}
                                                                                                    className="para-12px mb-1 text-theme-green"
                                                                                                >
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
                                                                                    <div className="price-block p-1 rounded mb-3 ms-auto text-end collection-hotel-price-block hotel-price">
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
                                                                                        {formattedOriginal &&
                                                                                            originalPrice > rate.price.total && (
                                                                                                <p
                                                                                                    className="para-12px mb-0 text-end collection-hotel-original-price"
                                                                                                    style={{
                                                                                                        color: 'red',
                                                                                                        textDecoration: 'line-through'
                                                                                                    }}
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
                                                                                        {/* <p className="para-12px text-muted mb-0">
                                                                            + {rate.price.total} taxes and charges
                                                                        </p> */}
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return null;
                                                                        })()}
                                                                    </div>

                                                                    <div
                                                                        className="d-flex justify-content-end mt-3 collection-hotel-cta-row collection-hotel-cta-col"
                                                                        style={
                                                                            effectiveViewMode === 'grid' ? { paddingTop: '6px' } : undefined
                                                                        }
                                                                    >
                                                                        <AppLink
                                                                            className="theme-button-blue rounded-4 d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 hotel-availability-button button-new"
                                                                            href={`${hotel.url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <span>See Availability</span>
                                                                            <i className="fa-solid fa-arrow-right ms-2"></i>
                                                                        </AppLink>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {hasMore && (
                                        <div ref={loadMoreTriggerRef} className="text-center py-4">
                                            <p className="text-muted mb-0">{loading ? 'Loading more...' : 'Loading more...'}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted">No hotels available in this collection yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </>
    );
}
