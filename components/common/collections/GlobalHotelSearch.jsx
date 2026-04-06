'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { searchHotelsGlobally } from '@/lib/api/admin/collectionapi';
import HotelRowInfo from './HotelRowInfo';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

const normalizeHotel = (hotel) => ({
    id: hotel?.id ?? hotel?.hotelId ?? null,
    name: hotel?.name ?? hotel?.hotelName ?? hotel?.Name ?? '',
    cityId: hotel?.cityId ?? null,
    cityName: hotel?.cityName ?? hotel?.city ?? hotel?.CityName ?? hotel?.City ?? '',
    address: hotel?.address ?? hotel?.Address ?? '',
    stars: hotel?.stars ?? hotel?.Stars ?? null,
    reviewScore: hotel?.reviewScore ?? hotel?.ReviewScore ?? null
});

export default function GlobalHotelSearch({ selectedHotels = [], hotelList = [], maxHotels = 20, onAddHotel }) {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedHotelIds = useMemo(() => new Set(selectedHotels), [selectedHotels]);
    const hotelListIds = useMemo(() => new Set(hotelList.map((hotel) => hotel.id)), [hotelList]);
    const effectiveMaxHotels = Number(maxHotels) || 20;

    useEffect(() => {
        const trimmed = searchText.trim();

        if (trimmed.length < MIN_CHARS) {
            setResults([]);
            setLoading(false);
            setError('');
            return undefined;
        }

        let cancelled = false;
        const timer = window.setTimeout(async () => {
            try {
                setLoading(true);
                setError('');

                const response = await searchHotelsGlobally(trimmed);
                const rawResults = response?.data?.hotels || response?.data || [];
                const normalized = Array.isArray(rawResults) ? rawResults.map(normalizeHotel).filter((hotel) => hotel.id) : [];

                if (cancelled) return;

                setResults(normalized);
            } catch (fetchError) {
                if (cancelled) return;

                console.error('Global hotel search failed:', fetchError);
                setResults([]);
                setError(fetchError?.message || 'Failed to search hotels');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, DEBOUNCE_MS);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [searchText]);

    const handleAdd = (hotel) => {
        const normalized = normalizeHotel(hotel);

        if (!normalized.id) return;
        if (selectedHotelIds.has(normalized.id) || hotelListIds.has(normalized.id)) return;
        if (selectedHotels.length >= effectiveMaxHotels) {
            toast.error(`You can only select up to ${effectiveMaxHotels} hotels`);
            return;
        }

        onAddHotel?.(normalized);
    };

    const canAddMore = selectedHotels.length < effectiveMaxHotels;

    return (
        <div className="mt-3">
            <label className="form-label fw-semibold mb-1">Global Hotel Search</label>
            <input
                type="text"
                className="form-control"
                placeholder="Search hotels globally..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="position-relative">
                {searchText.trim().length >= MIN_CHARS && (
                    <div className="border rounded bg-white mt-2 shadow-sm" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="p-3 text-muted">Searching...</div>
                        ) : error ? (
                            <div className="p-3 text-danger">{error}</div>
                        ) : results.length === 0 ? (
                            <div className="p-3 text-muted">No hotels found</div>
                        ) : (
                            results.map((hotel) => {
                                const isAlreadySelected = selectedHotelIds.has(hotel.id) || hotelListIds.has(hotel.id);
                                const isLimitReached = !isAlreadySelected && !canAddMore;

                                return (
                                    <div key={hotel.id} className="border-bottom p-3">
                                        <div className="d-flex justify-content-between gap-3 align-items-center">
                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                <HotelRowInfo
                                                    name={hotel.name}
                                                    stars={hotel.stars}
                                                    address={hotel.address}
                                                    reviewScore={hotel.reviewScore}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleAdd(hotel)}
                                                disabled={isAlreadySelected || isLimitReached}
                                            >
                                                {isAlreadySelected ? 'Added' : isLimitReached ? 'Limit Reached' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
