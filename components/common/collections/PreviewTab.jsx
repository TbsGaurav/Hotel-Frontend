'use client';

import { useState } from 'react';

export default function PreviewTab({ formData, rules, pinnedHotels, excludedHotels, onBack, onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAction = async (action) => {
        try {
            setIsSubmitting(true);
            await onSubmit(action);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <strong>Country:</strong> {formData.geoNodeId}
                </p>
                <p>
                    <strong>Type:</strong> {formData.mode}
                </p>
                <p>
                    <strong>Status:</strong> {formData.status}
                </p>
                <p>
                    <strong>Expiry Date:</strong> {formData.expiryDate || 'N/A'}
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
                <button type="button" className="btn btn-outline-secondary" onClick={onBack} disabled={isSubmitting}>
                    Back
                </button>

                {/* <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-primary" onClick={() => handleAction('draft')} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Save as Draft'}
                    </button>

                    <button
                        type="button"
                        className="theme-button-orange rounded-2"
                        onClick={() => handleAction('publish')}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Publish'}
                    </button>
                </div> */}

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                        onClick={() => handleAction('draft')}
                        disabled={isSubmitting}
                        style={{ minWidth: '100px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                        disabled={isSubmitting}
                        style={{ minWidth: '100px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
