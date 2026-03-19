'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCollectionById, getPreviewHotels } from '@/lib/api/admin/collectionapi';
import { ADMIN_ROUTES } from '@/lib/route';

export default function PreviewUI({ initialData, id }) {
    const [collection, setCollection] = useState(initialData);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            let data = initialData;

            if (!data) {
                const res = await getCollectionById(id);
                data = res?.data;
                console.log(data);
            }

            const previewRes = await getPreviewHotels(id);
            const previewHotels = previewRes?.data || [];
            console.log(previewRes);
            setCollection({
                ...(data || {}),
                collectionPreviewHotels: previewHotels
            });
        };

        load();
    }, [id, initialData]);
    if (!collection) return <p className="p-4">Loading preview...</p>;

    const basic = collection.basicCollection;
    const rules = collection.collectionRules?.[0]?.rules || [];
    const pinnedHotels = collection.collectionCuration?.[0]?.pinnedHotels || [];
    const excludedHotels = collection.collectionCuration?.[0]?.excludedHotels || [];
    if (!collection) return <p className="p-4">Loading preview...</p>;
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
        }
        return stars;
    };

    const previewHotels = collection.collectionPreviewHotels || [];
    const totalHotelsFound = previewHotels.length;

    const maxHotelsAllowed = basic?.maxHotels || 'Unlimited';

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <i
                        className="bi bi-arrow-left me-2 fs-5"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(ADMIN_ROUTES.collections)}
                    ></i>
                    <h5 className="mb-0">Collection Preview</h5>
                </div>

                <span className="badge bg-success px-3 py-2">{basic?.status}</span>
            </div>

            {/* BASIC INFO */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header fw-bold">Basic Information</div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <small className="fw-semibold">Collection Name</small>
                            <div className="text-muted">{basic?.name}</div>
                        </div>

                        <div className="col-md-6">
                            <small className="fw-semibold">Slug</small>
                            <div className="text-muted">{basic?.slug}</div>
                        </div>

                        <div className="col-md-6">
                            <small className="fw-semibold">GeoNode</small>
                            <div className="text-muted">{basic?.countryName || basic?.cityName || basic?.regionName}</div>
                        </div>

                        <div className="col-md-6">
                            <small className="fw-semibold">Template</small>
                            <div className="text-muted">{basic?.template}</div>
                        </div>

                        <div className="col-md-6">
                            <small className="fw-semibold">Max Hotels</small>
                            <div className="text-muted">{basic?.maxHotels}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RULES */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header fw-bold">Rules</div>
                <div className="card-body">
                    {rules.length === 0 ? (
                        <p className="text-muted">No rules defined</p>
                    ) : (
                        <div className="d-flex flex-wrap gap-2">
                            {rules.map((rule, i) => (
                                <span key={i} className="badge bg-light text-muted px-3 py-2">
                                    {rule.field} {rule.operator} {rule.value}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PINNED HOTELS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header fw-bold">Pinned Hotels</div>
                <div className="card-body">
                    {pinnedHotels.length === 0 ? (
                        <p className="text-muted">No pinned hotels</p>
                    ) : (
                        <ul className="list-unstyled mb-0">
                            {pinnedHotels.map((hotel, i) => (
                                <li key={hotel.hotelID} className="mb-1">
                                    <div className="fw-semibold text-dark">
                                        {i + 1}. {hotel.hotelName}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* EXCLUDED HOTELS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header fw-bold">Excluded Hotels</div>
                <div className="card-body">
                    {excludedHotels.length === 0 ? (
                        <p className="text-muted">No excluded hotels</p>
                    ) : (
                        <ul className="list-unstyled mb-0">
                            {excludedHotels.map((hotel, i) => (
                                <li key={hotel.hotelID} className="mb-1">
                                    <div className="fw-semibold text-dark">
                                        {i + 1}. {hotel.hotelName}
                                        <span className="text-muted"> ({hotel.reason})</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* PREVIEW HOTELS TABLE */}
            <div className="card shadow-sm">
                <div className="card-header fw-bold">Preview Hotels</div>
                <div className="card-body">
                    <div className="d-flex  justify-content-end gap-4 mb-3 text-muted small">
                        <div>
                            <span className="fw-semibold text-dark">Total Hotels Found:</span> {totalHotelsFound}
                        </div>

                        <div>
                            <span className="fw-semibold text-dark">Max Hotels Allowed:</span> {maxHotelsAllowed}
                        </div>
                    </div>
                    <div className="row g-3">
                        {previewHotels.map((hotel, index) => (
                            <div key={hotel.hotelId} className="col-md-12">
                                <div className="card border-0 shadow-sm hotel-card">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-semibold text-dark">{hotel.hotelName}</div>
                                            <div className="text-muted small">{hotel.hotelAddress}</div>
                                            <div className="text-warning small">{renderStars(hotel.stars)}</div>
                                            <div className="text-muted small">Review Score: {hotel.reviewScore}</div>
                                        </div>

                                        <div>
                                            {hotel.reason === 'Pinned' ? (
                                                <span className="badge bg-primary">Pinned</span>
                                            ) : (
                                                <span className="badge bg-light text-dark border">{hotel.reason}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
