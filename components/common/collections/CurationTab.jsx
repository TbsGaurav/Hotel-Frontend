'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import GlobalHotelSearch from './GlobalHotelSearch';
import HotelRowInfo from './HotelRowInfo';

export default function CurationTab({
    hotelList,
    pinnedHotels,
    setPinnedHotels,
    excludedHotels,
    setExcludedHotels,
    onNext,
    loading,
    hasMoreHotels = false,
    loadingMoreHotels = false,
    hotelSearch,
    setHotelSearch,
    onBack,
    maxHotels,
    selectedHotels,
    setSelectedHotels,
    newlyAddedHotels = [],
    onAddGlobalHotel,
    onLoadMoreHotels
}) {
    const [reasonModal, setReasonModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [reason, setReason] = useState('');

    const effectiveMaxHotels = Number(maxHotels) || 20;
    const normalizedSearch = hotelSearch.trim().toLowerCase();

    const sortedHotels = [...pinnedHotels, ...hotelList.filter((hotel) => !pinnedHotels.some((p) => p.id === hotel.id))];
    const visibleHotels = normalizedSearch
        ? sortedHotels.filter((hotel) => {
              const name = String(hotel?.name || '').toLowerCase();
              const address = String(hotel?.address || '').toLowerCase();
              return name.includes(normalizedSearch) || address.includes(normalizedSearch);
          })
        : sortedHotels;

    const handleCheckboxChange = (hotelId, checked) => {
        if (checked) {
            if (selectedHotels.length >= effectiveMaxHotels) {
                toast.error(`You can only select up to ${effectiveMaxHotels} hotels`);
                return;
            }
            setSelectedHotels((prev) => [...prev, hotelId]);
        } else {
            setSelectedHotels((prev) => prev.filter((id) => id !== hotelId));
        }
    };

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

        setSelectedHotels((prev) => prev.filter((id) => id !== selectedHotel.id));
        setPinnedHotels((prev) => prev.filter((h) => h.id !== selectedHotel.id));

        setReasonModal(false);
        setReason('');
    };

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

    const handleScroll = (event) => {
        if (!onLoadMoreHotels || loadingMoreHotels || !hasMoreHotels) return;

        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const nearBottom = scrollHeight - scrollTop - clientHeight < 48;

        if (nearBottom) {
            onLoadMoreHotels();
        }
    };

    const handleUnpin = (hotelId) => {
        setPinnedHotels((prev) => prev.filter((h) => h.id !== hotelId));
    };

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

            <div className="mb-2" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search hotel..."
                    value={hotelSearch}
                    onChange={(e) => setHotelSearch(e.target.value)}
                />
            </div>

            <div className="mb-2 text-end">
                Selected: {selectedHotels.length}/{effectiveMaxHotels}
            </div>

            <div className="border rounded p-3" style={{ maxHeight: '550px', overflowY: 'auto' }} onScroll={handleScroll}>
                {visibleHotels.map((hotel) => {
                    const isExcluded = excludedHotels.some((h) => h.id === hotel.id);
                    const pinIndex = pinnedHotels.findIndex((h) => h.id === hotel.id);
                    const isPinned = pinIndex !== -1;
                    const isSelected = selectedHotels.includes(hotel.id);
                    const isNewlyAdded = newlyAddedHotels.some((item) => item.id === hotel.id);

                    return (
                        <div
                            key={hotel.id}
                            className={`d-flex align-items-center border-bottom py-2 ${
                                isNewlyAdded ? 'border-start border-danger border-3 ps-2' : ''
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={isSelected || isPinned}
                                disabled={isExcluded || (!isSelected && selectedHotels.length >= effectiveMaxHotels)}
                                onChange={(e) => handleCheckboxChange(hotel.id, e.target.checked)}
                            />

                            <div className="flex-grow-1 d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                                {isPinned && <span className="text-warning fw-bold">* </span>}
                                <HotelRowInfo
                                    name={hotel.name}
                                    stars={hotel.stars}
                                    address={hotel.address || ''}
                                    reviewScore={hotel.reviewScore}
                                />
                                {isNewlyAdded && <span className="badge bg-danger">New</span>}
                                {isExcluded && <span className="text-danger">(Excluded)</span>}
                            </div>

                            {!isExcluded && (
                                <div className="d-flex align-items-center gap-1">
                                    {!isPinned ? (
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handlePin(hotel)}
                                            disabled={!isSelected}
                                        >
                                            Pin
                                        </button>
                                    ) : (
                                        <>
                                            {pinIndex > 0 && (
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => movePin(pinIndex, -1)}>
                                                    ^
                                                </button>
                                            )}

                                            {pinIndex < pinnedHotels.length - 1 && (
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => movePin(pinIndex, 1)}>
                                                    v
                                                </button>
                                            )}

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

                {loadingMoreHotels && (
                    <div className="py-3 text-center text-muted">
                        Loading more hotels...
                    </div>
                )}

                {!loadingMoreHotels && !hasMoreHotels && visibleHotels.length > 0 && !normalizedSearch && (
                    <div className="py-3 text-center text-muted">
                        You have reached the end of the hotel list.
                    </div>
                )}

                {normalizedSearch && visibleHotels.length === 0 && (
                    <div className="py-3 text-center text-muted">
                        No hotels match &quot;{hotelSearch}&quot;.
                    </div>
                )}
            </div>

            <GlobalHotelSearch
                hotelList={hotelList}
                selectedHotels={selectedHotels}
                maxHotels={effectiveMaxHotels}
                onAddHotel={onAddGlobalHotel}
            />

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
