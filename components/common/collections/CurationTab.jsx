'use client';

import { useEffect, useRef } from 'react';

export default function CurationTab({
    countries,
    setFormData,
    cities,
    selectedCity,
    setSelectedCity,
    pinnedHotels,
    setPinnedHotels,
    excludedHotels,
    setExcludedHotels,
    hotelSearch,
    setHotelSearch,
    excludeSearch,
    setExcludeSearch,
    excludeReason,
    setExcludeReason,
    pinnedOptions,
    excludeOptions,
    setSelectedPinnedHotel,
    setSelectedExcludeHotel,
    addPinnedHotel,
    addExcludedHotel,
    moveHotel,
    onNext,
    onBack,
    showPinnedDropdown,
    setShowPinnedDropdown,
    showExcludeDropdown,
    setShowExcludeDropdown,
    geoSearch,
    setGeoSearch,
    showGeoDropdown,
    setShowGeoDropdown,
    selectedGeoNode,
    setSelectedGeoNode,
    citySearch,
    setCitySearch,
    showCityDropdown,
    setShowCityDropdown,
    setSelectedCityObj,
    setCityOptions,
    loading,
    excludeError,
    setExcludeError
}) {
    const pinnedRef = useRef(null);
    const excludeRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-wrapper')) {
                setShowGeoDropdown(false);
                setShowCityDropdown(false);
            }

            // Pinned
            if (pinnedRef.current && !pinnedRef.current.contains(e.target)) {
                setShowPinnedDropdown(false);
            }

            // Exclude
            if (excludeRef.current && !excludeRef.current.contains(e.target)) {
                setShowExcludeDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <>
            <div className="row"></div>

            {/* ================= PINNED HOTELS ================= */}
            {/* {(formData.mode === 'Curated' || formData.mode === 'Hybrid') && (
            )} */}
            <div className="row">
                <div className="col-12 col-lg-6">
                    <h6>Pinned Hotels</h6>

                    <div className="position-relative" ref={pinnedRef}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search hotel"
                            value={hotelSearch}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPinnedDropdown(true);
                                setShowExcludeDropdown(false);
                            }}
                            onChange={(e) => {
                                setHotelSearch(e.target.value);
                                setSelectedPinnedHotel(null);
                                setShowPinnedDropdown(true);
                            }}
                        />

                        {showPinnedDropdown && pinnedOptions.length > 0 && (
                            <div
                                className="position-absolute bg-white border w-100 mt-1 rounded shadow-sm"
                                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                            >
                                {pinnedOptions.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className="p-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPinnedHotel(hotel);
                                            setHotelSearch(hotel.name);
                                            setShowPinnedDropdown(false);
                                        }}
                                    >
                                        {hotel.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <button className="theme-button-orange rounded-2 mb-3" onClick={addPinnedHotel}>
                            Add Pinned
                        </button>
                    </div>

                    {pinnedHotels.map((hotel, index) => (
                        <div
                            key={hotel.id}
                            className={`d-flex justify-content-between align-items-center py-2 ${
                                index !== pinnedHotels.length - 1 ? 'border-bottom' : ''
                            }`}
                        >
                            <div>
                                {index + 1}. {hotel.name}
                            </div>
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => moveHotel(index, -1)}>
                                    ↑
                                </button>
                                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => moveHotel(index, 1)}>
                                    ↓
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setPinnedHotels(pinnedHotels.filter((_, i) => i !== index))}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================= EXCLUDED HOTELS ================= */}
                <div className="col-12 col-lg-6">
                    <h6>Excluded Hotels</h6>

                    <div className="position-relative" ref={excludeRef}>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search hotel"
                            value={excludeSearch}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExcludeDropdown(true);
                                setShowPinnedDropdown(false);
                            }}
                            onChange={(e) => {
                                setExcludeSearch(e.target.value);
                                setSelectedExcludeHotel(null);
                                setShowExcludeDropdown(true);
                            }}
                        />

                        {showExcludeDropdown && excludeOptions.length > 0 && (
                            <div
                                className="position-absolute bg-white border w-100 mt-1 rounded shadow-sm"
                                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                            >
                                {excludeOptions.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className="p-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedExcludeHotel(hotel);
                                            setExcludeSearch(hotel.name);
                                            setShowExcludeDropdown(false);
                                        }}
                                    >
                                        {hotel.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reason Input */}
                    <input
                        type="text"
                        className={`form-control mb-1 ${excludeError ? 'is-invalid' : ''}`}
                        placeholder="Reason for exclusion"
                        value={excludeReason}
                        onChange={(e) => {
                            setExcludeReason(e.target.value);
                            if (e.target.value.trim()) {
                                setExcludeError('');
                            }
                        }}
                    />

                    {excludeError && <div className="text-danger small mb-2">{excludeError}</div>}

                    {/* Exclude Button */}
                    <button type="button" className="theme-button-orange  rounded-2 mb-3" onClick={addExcludedHotel}>
                        Exclude
                    </button>

                    {/* Excluded List */}
                    {excludedHotels.map((hotel, index) => (
                        // <div key={hotel.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div
                            key={hotel.id}
                            className={`d-flex justify-content-between align-items-center py-2 ${
                                index !== excludedHotels.length - 1 ? 'border-bottom' : ''
                            }`}
                        >
                            <div>
                                {hotel.name} — {hotel.reason}
                            </div>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setExcludedHotels(excludedHotels.filter((_, i) => i !== index))}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* {formData.mode === 'Rule' && <div className="alert alert-info">Rule Based collections do not allow manual pinning.</div>} */}

            {/* ================= NAVIGATION ================= */}
            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>
                <button
                    className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                    onClick={onNext}
                    disabled={loading}
                    style={{ minWidth: '100px' }}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        </>
                    ) : (
                        'Next'
                    )}
                </button>
            </div>
        </>
    );
}
