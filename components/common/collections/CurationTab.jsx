'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CurationTab({
    hotelList,
    pinnedHotels,
    setPinnedHotels,
    excludedHotels,
    setExcludedHotels,
    onNext,
    loading,
    hotelSearch,
    setHotelSearch,
    onBack,
    maxHotels
}) {
    const [reasonModal, setReasonModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [reason, setReason] = useState('');
    const [selectedHotels, setSelectedHotels] = useState([]);
    // ---------- SORT HOTELS (PINNED FIRST) ----------
    const sortedHotels = [...pinnedHotels, ...hotelList.filter((hotel) => !pinnedHotels.some((p) => p.id === hotel.id))];
    useEffect(() => {
        if (!hotelList.length) return;

        setSelectedHotels(hotelList.slice(0, maxHotels).map((h) => h.id));
    }, [hotelList, maxHotels]);
    // ---------- CHECKBOX ----------
    // const handleCheckboxChange = (hotel, checked) => {
    //     if (!checked) {
    //         setSelectedHotel(hotel);
    //         setReason('');
    //         setReasonModal(true);
    //         return;
    //     }

    //     // Re-include hotel
    //     setExcludedHotels((prev) => prev.filter((h) => h.id !== hotel.id));
    // };

    const handleCheckboxChange = (hotelId, checked) => {
        if (checked) {
            if (selectedHotels.length >= maxHotels) return;

            setSelectedHotels((prev) => [...prev, hotelId]);
        } else {
            setSelectedHotels((prev) => prev.filter((id) => id !== hotelId));
        }
    };
    // ---------- EXCLUDE ----------
    const confirmExclude = () => {
        if (!reason.trim()) return;

        setExcludedHotels((prev) => [
            ...prev,
            {
                id: selectedHotel.id,
                name: selectedHotel.name,
                reason
            }
        ]);

        // Remove from pinned if excluded
        setPinnedHotels((prev) => prev.filter((h) => h.id !== selectedHotel.id));

        setReasonModal(false);
    };

    // ---------- PIN ----------
    const handlePin = (hotel) => {
        setPinnedHotels((prev) => {
            if (prev.some((h) => h.id === hotel.id)) return prev;

            if (prev.length >= 8) {
                toast.warning('You can pin only 8 hotels');
                return prev;
            }

            return [...prev, hotel];
        });
    };

    // ---------- UNPIN ----------
    const handleUnpin = (hotelId) => {
        setPinnedHotels((prev) => prev.filter((h) => h.id !== hotelId));
    };

    // ---------- MOVE PIN ----------
    const movePin = (index, direction) => {
        const updated = [...pinnedHotels];
        const target = index + direction;

        if (target < 0 || target >= updated.length) return;

        [updated[index], updated[target]] = [updated[target], updated[index]];

        setPinnedHotels(updated);
    };

    return (
        <>
            <h6>Hotel List</h6>

            <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search hotel..."
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                    />
                </div>
                {sortedHotels.map((hotel) => {
                    const isExcluded = excludedHotels.some((h) => h.id === hotel.id);

                    const pinIndex = pinnedHotels.findIndex((h) => h.id === hotel.id);

                    const isPinned = pinIndex !== -1;

                    return (
                        <div key={hotel.id} className="d-flex align-items-center border-bottom py-2">
                            {/* Checkbox */}

                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={selectedHotels.includes(hotel.id)}
                                disabled={!selectedHotels.includes(hotel.id) && selectedHotels.length >= maxHotels}
                                onChange={(e) => handleCheckboxChange(hotel.id, e.target.checked)}
                            />
                            {/* Hotel Name */}
                            <span className="flex-grow-1">
                                {isPinned && <span className="text-warning fw-bold me-2">⭐ </span>}

                                {hotel.name}

                                {isExcluded && <span className="text-danger ms-2">(Excluded)</span>}
                            </span>

                            {/* PIN CONTROLS */}
                            {!isExcluded && (
                                <div className="d-flex align-items-center gap-1">
                                    {!isPinned ? (
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handlePin(hotel)}>
                                            Pin
                                        </button>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => movePin(pinIndex, -1)}>
                                                ↑
                                            </button>

                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => movePin(pinIndex, 1)}>
                                                ↓
                                            </button>

                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleUnpin(hotel.id)}>
                                                Unpin
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {reasonModal && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title">Reason for Exclusion</h6>
                            </div>

                            <div className="modal-body">
                                <input
                                    className="form-control"
                                    placeholder="Enter reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setReasonModal(false)}>
                                    Cancel
                                </button>

                                <button className="btn btn-danger" onClick={confirmExclude}>
                                    Exclude
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- NAVIGATION ---------- */}
            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>

                <button className="theme-button-orange rounded-1" onClick={onNext} disabled={loading}>
                    Next
                </button>
            </div>
        </>
    );
}
