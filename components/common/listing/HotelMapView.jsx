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

export default function HotelMapView({
    hotels = [],
    apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    height = 420,
    className = ''
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    const [error, setError] = useState('');

    const hotelsWithCoords = useMemo(() => {
        return (Array.isArray(hotels) ? hotels : [])
            .map((hotel) => ({ hotel, pos: getHotelLatLng(hotel) }))
            .filter((item) => Boolean(item.pos));
    }, [hotels]);

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
                    infoWindowRef.current = new maps.InfoWindow();
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
                        title
                    });

                    const handleClick = () => {
                        const title = getHotelTitle(hotel);
                        const url = getHotelUrl(hotel);
                        const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        const content = url
                            ? `<div style="min-width:180px"><div style="font-weight:600;margin-bottom:6px">${safeTitle}</div><a href="${url}" target="_blank" rel="noopener noreferrer">Open hotel</a></div>`
                            : `<div style="min-width:180px"><div style="font-weight:600">${safeTitle}</div></div>`;
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
    }, [apiKey, hotelsWithCoords]);

    return (
        <div className={className}>
            {error ? <div className="alert alert-warning mb-3">{error}</div> : null}
            <div
                ref={containerRef}
                style={{
                    height: typeof height === 'number' ? `${height}px` : height,
                    width: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#f1f3f5'
                }}
            />
        </div>
    );
}
