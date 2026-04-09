'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import { getUserCurrency } from '@/lib/getUserCurrency';
import Image from 'next/image';

export default function CollectionDetails({ collection, hotels, hotelRates, totalCount, currentPage, pageSize, collectionId }) {
    const basic = collection?.basicCollection;
    const content = collection?.collectionContent;

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

    // Pagination state
    const [loading, setLoading] = useState(false);
    const [allHotels, setAllHotels] = useState(() => mergeUniqueHotels([], hotels || []));
    const [allRates, setAllRates] = useState(hotelRates || []);
    const [page, setPage] = useState(currentPage || 1);
    const [hasMore, setHasMore] = useState((hotels?.length || 0) < (totalCount || 0));
    const [currency, setCurrency] = useState(null);
    const loadMoreTriggerRef = useRef(null);
    const loadRequestInFlightRef = useRef(false);
    const pageRef = useRef(currentPage || 1);

    const openMap = (lat, lng) => {
        if (!lat || !lng) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    };

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
        if (loadRequestInFlightRef.current || !hasMore) return;

        loadRequestInFlightRef.current = true;
        setLoading(true);
        const nextPage = pageRef.current + 1;

        try {
            const hotelsRes = await getHotelsByCollection(collectionId, nextPage, pageSize);
            // Handle new API response structure: data.hotelData and data.totalCount
            const newHotels = hotelsRes?.data?.hotelData || hotelsRes?.data || [];

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
                    {/* <div className="py-2">
                        <div className="container">
                            <div className="d-flex align-items-center small">
                                <Link href="/" className="text-dark text-decoration-none">
                                    Home
                                </Link>
                                <span className="mx-2 text-muted">•</span>
                                <span className="fw-semibold text-decoration-none text-primary">{basic[0]?.name}</span>
                            </div>
                        </div>
                    </div> */}
                    <div className="py-2 py-lg-3">
                        <div className="container">
                            <nav aria-label="breadcrumb" className="mb-0">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item small-para-14-px">
                                        <Link href="/" className="text-dark text-decoration-none">
                                            Home
                                        </Link>
                                    </li>

                                    <li className="breadcrumb-item small-para-14-px active">
                                        <Link href={`/${basic[0]?.name}`} className="text-decoration-none">
                                            {basic[0]?.name}
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <section className="container py-4 py-lg-5">
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
                    </section>

                    <div className="container">
                        {allHotels.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {allHotels.map((hotel, index) => (
                                    <div
                                        key={`${getHotelIdentity(hotel)}-${index}`}
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
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                    <Image
                                                        src={getImageUrl(hotel?.photo)}
                                                        width={400}
                                                        height={270}
                                                        className="d-block w-100 rounded-4 collection-hotel-image"
                                                        alt={hotel.hotelName}
                                                        onError={handleImageError}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-8 collection-hotel-content-col">
                                                <div className="text-decoration-none">
                                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-2 collection-hotel-header">
                                                        <div className="d-flex flex-wrap align-items-center mb-2 mb-md-0 collection-hotel-title-row">
                                                            <Link
                                                                href={`${hotel.urlName}`}
                                                                className="font-size-16 font-size-md-18 my-auto me-2 me-md-3 hotel-name-link collection-hotel-title"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {hotel.hotelName}
                                                            </Link>
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

                                                        <div className="d-flex align-items-center collection-hotel-review-row">
                                                            <div
                                                                className="rating-box d-flex me-2 collection-hotel-rating-box"
                                                                style={{ borderRadius: '10px 10px 10px 0px' }}
                                                            >
                                                                <span className="m-auto">
                                                                    {hotel.reviewScore === 0 ? 'N/A' : hotel.reviewScore}
                                                                </span>
                                                            </div>

                                                            <div className="my-auto collection-hotel-review-copy">
                                                                <p className="small-para-14-px font-weight-bold mb-1 collection-hotel-rating-text">
                                                                    {hotel.ratingText}
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
                                                                    <span
                                                                        className="rating"
                                                                        style={{ fontSize: '11px', lineHeight: '1.2' }}
                                                                    >
                                                                        +{hotel.hotelFacilities.split('|').length - 5} more
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* <p
                                                        className="small-para-14-px mb-2 hotel-address-link collection-hotel-address"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openMap(hotel.latitude, hotel.longitude);
                                                        }}
                                                    >
                                                        <FaMapMarkerAlt className="me-1 hotel-address-icon" />
                                                        {hotel.hotelAddress || hotel.address}
                                                    </p> */}
                                                    {(hotel.hotelAddress || hotel.address) && (
                                                        <p
                                                            className="small-para-14-px mb-2 hotel-address-link collection-hotel-address"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openMap(hotel.latitude, hotel.longitude);
                                                            }}
                                                        >
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
                                                                        {/* <p className="para-12px text-muted mb-0">
                                                                            + {rate.price.total} taxes and charges
                                                                        </p> */}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>

                                                    <div className="row collection-hotel-cta-row">
                                                        <div className="col-12 col-md-4 col-lg-3 ms-auto collection-hotel-cta-col">
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
                                ))}

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
                </>
            )}
        </>
    );
}
