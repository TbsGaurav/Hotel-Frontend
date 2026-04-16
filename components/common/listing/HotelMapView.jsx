'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

function normalizeNumber(value) {
    const n = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(n) ? n : null;
}

function getHotelLatLng(hotel) {
    const lat = normalizeNumber(getFirstDefined(hotel?.latitude, hotel?.lat, hotel?.Latitude));
    const lng = normalizeNumber(getFirstDefined(hotel?.longitude, hotel?.lng, hotel?.Longitude));
    if (lat === null || lng === null) return null;
    return { lat, lng };
}

function getHotelTitle(hotel) {
    return String(getFirstDefined(hotel?.hotelName, hotel?.name, hotel?.HotelName) || '').trim() || 'Hotel';
}

function getHotelUrl(hotel) {
    return getFirstDefined(hotel?.url, hotel?.urlName, hotel?.Url) || '';
}

function getRatingText(score) {
    const value = Number(score);
    if (!value) return 'Not rated';
    if (value >= 9) return 'Exceptional';
    if (value >= 8) return 'Excellent';
    if (value >= 7) return 'Very good';
    if (value >= 6) return 'Good';
    return 'Pleasant';
}

export default function HotelMapView({
    hotels = [],
    apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    height = 420,
    className = '',
    allRates = []
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    const [error, setError] = useState('');
    const [failedImageKeys, setFailedImageKeys] = useState(() => new Set());

    const defaultImage = '/image/property-img.webp';

    const hotelsWithCoords = useMemo(() => {
        return (Array.isArray(hotels) ? hotels : [])
            .map((hotel) => ({ hotel, pos: getHotelLatLng(hotel) }))
            .filter((item) => Boolean(item.pos));
    }, [hotels]);

    const getHotelRate = (bookingId) => {
        return allRates?.find((rate) => String(rate?.id) === String(bookingId));
    };

    const getBookingId = (hotel) => {
        const bookingId = Number(hotel?.bookingId);
        return Number.isInteger(bookingId) && bookingId > 0 ? bookingId : null;
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
        const normalizedUrl = normalizeImageUrl(photo);
        if (normalizedUrl === defaultImage) return defaultImage;
        return normalizedUrl;
    };

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

    const createInfoWindowContent = (hotel) => {
        const title = getHotelTitle(hotel);
        const url = getHotelUrl(hotel);
        const stars = hotel?.stars || 0;
        const address = hotel?.hotelAddress || hotel?.address || '';
        const rate = getHotelRate(getBookingId(hotel));

        const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeAddress = address.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Generate star HTML
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<svg viewBox="0 0 24 24" fill="${i < stars ? '#f0831e' : '#ddd'}">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>`;
        }

        // Price HTML
        let priceHtml = '';
        if (rate?.price) {
            const dealInfo = rate?.deal_info || {};
            const originalPrice = dealInfo?.public_price;
            const formattedOriginal = formatOriginalPrice(rate.price.book, originalPrice);

            priceHtml = `
            <div class="info-window-price-section">
                ${formattedOriginal && originalPrice > rate.price.total ? `
                    <div class="info-window-original-price">${formattedOriginal}</div>
                ` : ''}
                <div class="info-window-current-price">${rate.price.book}</div>
            </div>
        `;
        }

        return `
        <div class="info-window-container">
            <button class="custom-info-window-close" onclick="this.closest('.info-window-container').parentElement.parentElement.parentElement.querySelector('button[title=\\'Close\\']').click()">×</button>
            <div class="info-window-grid">
                <img src="${getImageUrl(hotel?.photo)}" 
                     class="info-window-image"
                     onerror="this.src='${defaultImage}'"
                     alt="${safeTitle}"/>
                <div class="info-window-details">
                    <div class="info-window-title">${safeTitle}</div>
                    <div class="info-window-stars">${starsHtml}</div>
                    <div class="info-window-address" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}', '_blank')">
                        <span>${safeAddress.substring(0, 60)}${safeAddress.length > 60 ? '...' : ''}</span>
                    </div>
                    ${priceHtml}
                    <div>
                        <a href="${url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="info-window-book-btn">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    };

    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                setError('');
                const maps = await loadGoogleMaps({ apiKey });
                if (cancelled) return;
                if (!maps?.Map) return;
                if (!containerRef.current) return;

                const first = hotelsWithCoords[0]?.pos || { lat: -25.2744, lng: 133.7751 };

                if (!mapRef.current) {
                    mapRef.current = new maps.Map(containerRef.current, {
                        center: first,
                        zoom: hotelsWithCoords.length ? 12 : 4,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false
                    });
                }

                if (!infoWindowRef.current) {
                    infoWindowRef.current = new maps.InfoWindow({
                        maxWidth: 340
                    });
                }

                markersRef.current.forEach((m) => m.setMap(null));
                markersRef.current = [];

                if (!hotelsWithCoords.length) {
                    mapRef.current.setCenter(first);
                    mapRef.current.setZoom(4);
                    return;
                }

                const bounds = new maps.LatLngBounds();

                hotelsWithCoords.forEach(({ hotel, pos }) => {
                    const title = getHotelTitle(hotel);

                    const marker = new maps.Marker({
                        position: pos,
                        map: mapRef.current,
                        title,
                    });

                    const handleClick = () => {
                        const content = createInfoWindowContent(hotel);
                        infoWindowRef.current.setContent(content);
                        infoWindowRef.current.open({ map: mapRef.current, anchor: marker });
                    };

                    marker.addListener('click', handleClick);

                    markersRef.current.push(marker);
                    bounds.extend(pos);
                });

                mapRef.current.fitBounds(bounds, 60);
            } catch (e) {
                if (!cancelled) setError(e?.message || 'Failed to load map.');
            }
        }

        init();

        return () => {
            cancelled = true;
        };
    }, [apiKey, hotelsWithCoords, allRates]);

    return (
        <div className={className}>
            {error ? <div className="alert alert-warning mb-3">{error}</div> : null}
            <div
                ref={containerRef}
                className="map-container"
                style={{
                    height: typeof height === 'number' ? `${height}px` : height
                }}
            />
        </div>
    );
}
