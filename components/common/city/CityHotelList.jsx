'use client';

import { useEffect, useRef, useState } from 'react';
import AppLink from '@/components/common/AppLink';
import Image from 'next/image';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaHotel, FaSearch, FaRegCompass } from 'react-icons/fa';
import { getHotelList, getHotelRates } from '@/lib/api/public/hotelapi';
import { getUserCurrency } from '@/lib/getUserCurrency';
import HotelMapView from '@/components/common/listing/HotelMapView';
import HotelListToolbar from '@/components/common/listing/HotelListToolbar';

export default function CityHotelList({
    hotels,
    totalCount = 0,
    currentPage = 1,
    pageSize = 10,
    fetchMoreHotels,
    citySlugPath,
    content,
    citySlug,
    countryId = null,
    regionHotelsSource = [],
    pageIntentCookieName = '',
    pageCookieName,
    mapVisible = false,
    onMapVisibleChange = null,
    viewMode: controlledViewMode = 'list',
    onViewModeChange = null,
    showToolbar = true
}) {
    const [loading, setLoading] = useState(false);
    const [allHotels, setAllHotels] = useState(hotels || []);
    const [allRates, setAllRates] = useState([]);
    const [page, setPage] = useState(currentPage || 1);
    const [hasMore, setHasMore] = useState((hotels?.length || 0) < (totalCount || 0) || (hotels?.length || 0) === pageSize);
    const [currency, setCurrency] = useState(null);
    const [uncontrolledViewMode, setUncontrolledViewMode] = useState('list');
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [timestamp, setTimestamp] = useState('');

    const [failedImageKeys, setFailedImageKeys] = useState(() => new Set());
    const loadMoreTriggerRef = useRef(null);
    const loadRequestInFlightRef = useRef(false);

    const defaultImage = '/image/property-img.webp';
    const computeHasMore = ({ loadedCount = 0, knownTotalCount = 0, currentPageNumber = 1, currentPageSize = 10, lastBatchSize = 0 }) => {
        const normalizedTotal = Number(knownTotalCount || 0);

        if (normalizedTotal > 0) {
            return loadedCount < normalizedTotal && currentPageNumber * currentPageSize < normalizedTotal;
        }

        return lastBatchSize === currentPageSize;
    };

    const getFirstDefined = (...values) => {
        for (const value of values) {
            if (value !== undefined && value !== null && value !== '') return value;
        }
        return null;
    };

    const getBookingId = (hotel) => {
        const bookingId = Number(hotel?.bookingId);
        return Number.isInteger(bookingId) && bookingId > 0 ? bookingId : null;
    };

    const dedupeHotels = (list) => {
        const seen = new Set();
        const result = [];
        list.forEach((hotel) => {
            const id = getBookingId(hotel) ?? hotel?.hotelId ?? hotel?.id;
            const key = id !== undefined && id !== null && id !== '' ? String(id) : null;
            if (key && seen.has(key)) return;
            if (key) seen.add(key);
            result.push(hotel);
        });
        return result;
    };

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
        async function initCurrency() {
            const cur = await getUserCurrency();
            setCurrency(cur);
        }

        initCurrency();
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const dedupedHotels = dedupeHotels(hotels || []);
            setAllHotels(dedupedHotels);
            setPage(currentPage || 1);
            setHasMore(
                computeHasMore({
                    loadedCount: dedupedHotels.length,
                    knownTotalCount: totalCount,
                    currentPageNumber: currentPage || 1,
                    currentPageSize: pageSize,
                    lastBatchSize: hotels?.length || 0
                })
            );
        }, 0);

        return () => window.clearTimeout(timer);
    }, [hotels, totalCount, currentPage, pageSize]);

    const getReviewScore = (hotel) =>
        hotel?.reviewScore ?? hotel?.ReviewScore ?? hotel?.review_score ?? hotel?.ratingScore ?? hotel?.rating ?? hotel?.score ?? null;
    const getReviewCount = (hotel) =>
        hotel?.reviewCount ??
        hotel?.ReviewCount ??
        hotel?.review_count ??
        hotel?.reviews ??
        hotel?.reviewTotal ??
        hotel?.totalReviews ??
        null;

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

    const getHotelRate = (bookingId) => allRates.find((rate) => String(rate?.id) === String(bookingId));

    const getHotelKey = (hotel, index) => {
        const bookingId = getBookingId(hotel);
        const rawKey = getFirstDefined(bookingId, hotel?.hotelId, hotel?.id, hotel?.urlName, hotel?.url);

        return rawKey ? `${rawKey}-${index}` : `hotel-${index}`;
    };

    const getRatingText = (score) => {
        const value = Number(score);

        if (!value) return 'Not rated';
        if (value >= 9) return 'Exceptional';
        if (value >= 8) return 'Excellent';
        if (value >= 7) return 'Very good';
        if (value >= 6) return 'Good';
        return 'Pleasant';
    };

    const getHotelFacilitiesText = (hotel) => hotel?.hotelFacilities ?? hotel?.hotelFacility ?? hotel?.facilities ?? hotel?.facility ?? '';

    const formatOriginalPrice = (currentPriceStr, originalPrice) => {
        if (!currentPriceStr || !originalPrice) return null;

        const match = currentPriceStr.match(/^[^\d-]+/u);
        if (match) {
            const detectedCurrency = match[0].trim();
            const formattedNum = originalPrice.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            return `${detectedCurrency}${formattedNum}`;
        }

        return `$${originalPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    };

    const loadMoreHotels = () => {
        if (loadRequestInFlightRef.current || !hasMore) return;

        loadRequestInFlightRef.current = true;
        setLoading(true);

        const nextPage = page + 1;

        if (typeof fetchMoreHotels === 'function') {
            Promise.resolve(
                fetchMoreHotels({
                    pageNumber: nextPage,
                    pageSize
                })
            )
                .then((response) => {
                    const normalizedResponse = Array.isArray(response) ? { hotels: response } : response || {};
                    const normalizedHotels = Array.isArray(normalizedResponse.hotels) ? normalizedResponse.hotels : [];
                    if (!normalizedHotels.length) {
                        setHasMore(false);
                        return;
                    }

                    const mergedHotels = dedupeHotels([...allHotels, ...normalizedHotels]);
                    const resolvedPageNo = Number(normalizedResponse.pageNo || nextPage || 1);
                    const resolvedPageSize = Number(normalizedResponse.pageSize || pageSize || 10);
                    const resolvedTotalCount = Number(normalizedResponse.totalCount || totalCount || 0);
                    const listGrew = mergedHotels.length > allHotels.length;
                    setAllHotels(mergedHotels);
                    setPage(resolvedPageNo);
                    setHasMore(
                        listGrew &&
                            computeHasMore({
                                loadedCount: mergedHotels.length,
                                knownTotalCount: resolvedTotalCount,
                                currentPageNumber: resolvedPageNo,
                                currentPageSize: resolvedPageSize,
                                lastBatchSize: normalizedHotels.length
                            })
                    );

                    if (pageCookieName) {
                        document.cookie = `${pageCookieName}=${resolvedPageNo}; path=/; SameSite=Lax`;
                    }

                    if (pageIntentCookieName) {
                        document.cookie = `${pageIntentCookieName}=1; path=/; SameSite=Lax; Max-Age=20`;
                    }
                })
                .catch((error) => {
                    console.error('Error loading more hotels:', error);
                })
                .finally(() => {
                    loadRequestInFlightRef.current = false;
                    setLoading(false);
                });
            return;
        }

        if (!citySlug) {
            setHasMore(false);
            setLoading(false);
            loadRequestInFlightRef.current = false;
            return;
        }

        getHotelList(citySlug, { countryId, pageNumber: nextPage, pageSize })
            .then((response) => {
                const nextHotels = response?.hotels || [];
                if (!nextHotels.length) {
                    setHasMore(false);
                    return;
                }

                setAllHotels((prev) => dedupeHotels([...prev, ...nextHotels]));
                setPage(nextPage);
                setHasMore(
                    computeHasMore({
                        loadedCount: allHotels.length + nextHotels.length,
                        knownTotalCount: Number(response?.totalCount || totalCount || 0),
                        currentPageNumber: nextPage,
                        currentPageSize: pageSize,
                        lastBatchSize: nextHotels.length
                    })
                );

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
                loadRequestInFlightRef.current = false;
                setLoading(false);
            });
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
    }, [hasMore, loading, page, citySlug, pageSize, pageIntentCookieName, pageCookieName]);

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

    const navigateToHotel = (url) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const isControlled = typeof onViewModeChange === 'function';
    const activeViewMode = isControlled ? controlledViewMode : uncontrolledViewMode;
    const setViewMode = isControlled ? onViewModeChange : setUncontrolledViewMode;
    const effectiveViewMode = isMobileViewport ? 'list' : activeViewMode;

    return (
        <div className="p-0">
            {content && <div className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: content }} />}

            {showToolbar && !isMobileViewport ? (
                <HotelListToolbar
                    viewMode={activeViewMode}
                    onViewModeChange={setViewMode}
                    mapVisible={mapVisible}
                    onMapToggle={() => {
                        if (typeof onMapVisibleChange === 'function') {
                            onMapVisibleChange(!mapVisible);
                        } else {
                            window.dispatchEvent(new CustomEvent('hotel-map-toggle'));
                        }
                    }}
                    resultsCount={allHotels.length}
                    className="mb-2"
                />
            ) : null}

            {mapVisible ? <HotelMapView hotels={allHotels} className="mb-4" allRates={allRates} /> : null}
            <div className={`${effectiveViewMode === 'grid' ? 'row g-3 grid-view' : 'd-flex flex-column gap-3'}`}>
                {' '}
                {allHotels.map((hotel, index) => {
                    const hotelKey = getHotelKey(hotel, index);
                    const rate = getHotelRate(getBookingId(hotel));
                    const reviewScore = getReviewScore(hotel);
                    const reviewScoreValue =
                        reviewScore !== null && reviewScore !== undefined && reviewScore !== '' ? Number(reviewScore) : null;
                    const reviewCount = getReviewCount(hotel);
                    const reviewCountValue =
                        reviewCount !== null && reviewCount !== undefined && reviewCount !== '' ? Number(reviewCount) : null;
                    const badges = rate?.badges || [];
                    const hotelFacilitiesText = getHotelFacilitiesText(hotel);
                    const imageBadges = badges.filter(
                        (badge) => !badge.toLowerCase().includes('free cancellation') && !badge.toLowerCase().includes('pay at')
                    );
                    const infoBadges = badges.filter(
                        (badge) => badge.toLowerCase().includes('free cancellation') || badge.toLowerCase().includes('pay at')
                    );

                    return (
                        <div key={hotelKey} className={effectiveViewMode === 'grid' ? 'col-12 col-md-6' : ''}>
                            <div
                                className={`card border-0 rounded-4 hotel-list-card collection-hotel-card ${effectiveViewMode === 'grid' ? 'p-3 h-100 ' : 'p-3 p-md-4'}`}
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
                                    <div className={`col-12 ${effectiveViewMode === 'grid' ? '' : 'col-md-4'} collection-hotel-image-col`}>
                                        <div
                                            className="position-relative collection-hotel-image-wrap rounded-4 overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${defaultImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {imageBadges.length > 0 && (
                                                <>
                                                    {imageBadges.map((badge, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={
                                                                isMobileViewport ? 'image-ribbon' : 'position-absolute text-white px-3 py-1'
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
                                            <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-2 collection-hotel-header">
                                                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 mb-md-0 collection-hotel-title-row">
                                                    {/* <div className="d-flex flex-wrap align-items-center mb-2 mb-md-0 collection-hotel-title-row"> */}
                                                    <AppLink
                                                        href={`${hotel.urlName}`}
                                                        className="property-grid-title font-size-16 font-size-md-18 my-auto me-2 me-md-3 hotel-name-link"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                                    >
                                                        {hotel.hotelName}
                                                    </AppLink>
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
                                                {hotelFacilitiesText && (
                                                    <>
                                                        {hotelFacilitiesText
                                                            .split('|')
                                                            .map((facility) => facility.trim())
                                                            .filter(Boolean)
                                                            .slice(0, 5)
                                                            .map((facility, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="badge bg-light text-dark border me-1 mb-1 ellips"
                                                                    title={facility}
                                                                >
                                                                    {facility}
                                                                </span>
                                                            ))}
                                                        {hotelFacilitiesText
                                                            .split('|')
                                                            .map((facility) => facility.trim())
                                                            .filter(Boolean).length > 5 && (
                                                            <span className="rating star-rating">
                                                                +
                                                                {hotelFacilitiesText
                                                                    .split('|')
                                                                    .map((facility) => facility.trim())
                                                                    .filter(Boolean).length - 5}{' '}
                                                                more
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
                                                                    <span className="me-2 text-theme-green" style={{ fontSize: '13px' }}>
                                                                        <i className="fa-solid fa-check me-1"></i>
                                                                        {badge}
                                                                    </span>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {(() => {
                                                    if (!rate?.price) {
                                                        return (
                                                            <div className="price-block p-1 rounded mb-3 ms-auto text-end collection-hotel-price-block price-bottom">
                                                                <p className="para-12px text-muted mb-1 text-end collection-hotel-price-caption">
                                                                    1 night, 2 adults
                                                                </p>
                                                                <div className="d-flex align-items-baseline justify-content-end collection-hotel-current-price-row">
                                                                    <span
                                                                        className="text-theme-orange fw-bold collection-hotel-current-price"
                                                                        style={{ fontSize: '16px' }}
                                                                    >
                                                                        Check Price
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    const dealInfo = rate?.deal_info || {};
                                                    const originalPrice = dealInfo?.public_price;
                                                    const formattedOriginal = formatOriginalPrice(rate.price.book, originalPrice);

                                                    return (
                                                        <div className="price-block p-1 rounded mb-3 ms-auto text-end collection-hotel-price-block price-bottom">
                                                            <p className="para-12px text-muted mb-1 text-end collection-hotel-price-caption">
                                                                1 night, 2 adults
                                                            </p>

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
                                                })()}
                                            </div>
                                            <div
                                                className="d-flex justify-content-end mt-3 collection-hotel-cta-row collection-hotel-cta-col"
                                                style={effectiveViewMode === 'grid' ? { paddingTop: '6px' } : undefined}
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
    );
}
