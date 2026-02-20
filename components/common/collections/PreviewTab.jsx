'use client';

import { useState } from 'react';

export default function PreviewTab({ formData, rules, pinnedHotels, excludedHotels, onBack, onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        try {
            setIsSubmitting(true);
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h5 className="mb-4">Preview Collection</h5>

            {/* ================= BASIC INFO ================= */}
            <div className="border rounded p-3 mb-4">
                <h6>Basic Information</h6>
                <p>
                    <strong>Name:</strong> {formData.name}
                </p>
                <p>
                    <strong>Slug:</strong> {formData.slug}
                </p>
                <p>
                    <strong>GeoNode ID:</strong> {formData.geoNodeId}
                </p>
                <p>
                    <strong>Mode:</strong> {formData.mode}
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

                <button type="button" className="btn btn-success" onClick={handlePublish} disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
            </div>
        </>
    );
}
