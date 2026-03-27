'use client';

import { useState } from 'react';

const slugifyText = (value = '') =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export default function PreviewTab({
    formData,
    rules,
    pinnedHotels,
    excludedHotels,
    onBack,
    onSubmit,
    locationNames,
    selectedCities,
    slugCityId
}) {
    const [submittingType, setSubmittingType] = useState(null);
    const handleAction = async (action) => {
        try {
            setSubmittingType(action);
            await onSubmit(action);
        } finally {
            setSubmittingType(null);
        }
    };
    const geoName =
        locationNames.districtName || locationNames.cityName || locationNames.regionName || locationNames.countryName || formData.sourceId;
    const slugBase = formData.slugBase || String(formData.slug || '').split('/').slice(1).join('/') || formData.slug;
    const selectedSlugCity = selectedCities?.find((city) => city.cityId === slugCityId) || null;
    const previewSlug = selectedSlugCity ? `${slugifyText(selectedSlugCity.name || '')}/${slugBase}` : slugBase;

    return (
        <>
            {/* ================= BASIC INFO ================= */}
            <div className="border rounded p-3 mb-4">
                <h6>Basic Information</h6>
                <p>
                    <strong>Collection Name:</strong> {formData.name}
                </p>
                <p>
                    <strong>Slug:</strong> {formData.slug}
                </p>
                <p>
                    <strong>Slug Namespace:</strong> {selectedSlugCity?.name || 'No city selected'}
                </p>
                <p>
                    <strong>Preview URL:</strong> {previewSlug ? `${previewSlug}.htm` : 'No slug yet'}
                </p>
                <p>
                    <strong>GeoLocation:</strong> {geoName || ''}
                </p>
                <p>
                    <strong>Type:</strong> {formData.mode}
                </p>
                <p>
                    <strong>Status:</strong> {formData.status}
                </p>
                <p>
                    <strong>Max Hotels:</strong> {formData.maxHotels || 'Not Set'}
                </p>
            </div>

            {/* ================= RULES ================= */}
            {(formData.mode === 'Rule' || formData.mode === 'Hybrid') && (
                <div className="border rounded p-3 mb-4">
                    <h6>Rules</h6>

                    {rules.length === 0 ? (
                        <p className="text-muted">No rules added</p>
                    ) : (
                        rules.map((rule, index) => (
                            <div key={index}>
                                {rule.Field} {rule.Operator} {rule.Value}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ================= PINNED HOTELS ================= */}
            {(formData.mode === 'Curated' || formData.mode === 'Hybrid') && (
                <div className="border rounded p-3 mb-4">
                    <h6>Pinned Hotels</h6>

                    {pinnedHotels.length === 0 ? (
                        <p className="text-muted">No pinned hotels</p>
                    ) : (
                        pinnedHotels.map((hotel, index) => (
                            <div key={hotel.id}>
                                {index + 1}. {hotel.name}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ================= EXCLUDED HOTELS ================= */}
            <div className="border rounded p-3 mb-4">
                <h6>Excluded Hotels</h6>

                {excludedHotels.length === 0 ? (
                    <p className="text-muted">No excluded hotels</p>
                ) : (
                    excludedHotels.map((hotel) => (
                        <div key={hotel.id}>
                            {hotel.name} — {hotel.reason}
                        </div>
                    ))
                )}
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={onBack} disabled={submittingType}>
                    Back
                </button>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                        onClick={() => handleAction('draft')}
                        disabled={submittingType !== null}
                        style={{ minWidth: '100px' }}
                    >
                        {submittingType === 'draft' ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Saving...
                            </>
                        ) : (
                            'Save as Draft'
                        )}
                    </button>

                    <button
                        type="button"
                        className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                        onClick={() => handleAction('publish')}
                        disabled={submittingType !== null}
                        style={{ minWidth: '120px' }}
                    >
                        {submittingType === 'publish' ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Publishing...
                            </>
                        ) : (
                            'Publish'
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
