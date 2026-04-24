

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLink from '../common/AppLink';

const DROPDOWN_TOGGLE_EVENT = 'shared-dropdown-toggle';

export default function Dropdown({
    id,
    title,
    items = [],
    parentId,
    defaultOpen = false
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const headingId = `heading-${id}`;
    const collapseId = `collapse-${id}`;

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!isOpen) return;

        window.dispatchEvent(
            new CustomEvent(DROPDOWN_TOGGLE_EVENT, {
                detail: {
                    parentId,
                    activeId: id
                }
            })
        );
    }, [id, isOpen, parentId]);

    useEffect(() => {
        const handleSharedToggle = (event) => {
            const detail = event?.detail || {};

            if (!detail.parentId || detail.parentId !== parentId) return;
            if (detail.activeId === id) return;

            setIsOpen(false);
        };

        window.addEventListener(DROPDOWN_TOGGLE_EVENT, handleSharedToggle);

        return () => {
            window.removeEventListener(DROPDOWN_TOGGLE_EVENT, handleSharedToggle);
        };
    }, [id, parentId]);

    return (
        <div className="accordion mb-4 accordion-top" id={parentId}>
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id={headingId}>
                    <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-controls={collapseId}
                        style={{
                            background: '#f5f6f7',
                            borderRadius: '11px',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}
                    >
                        <span className="fs-5 fw-semibold">{title}</span>
                    </button>
                </h2>

                <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={headingId}
                >
                    <div className="accordion-body accordion-main">
                        <div className="row">
                            {items.length === 0 ? (
                                <div className="col-12 text-muted">No data found</div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={index} className="col-6 col-md-4 col-lg-3 country-list">
                                        {item.href ? (
                                            <AppLink href={item.href} className="text-decoration-none text-dark" prefetch={false}>
                                                {item.label}
                                            </AppLink>
                                        ) : (
                                            <span className="text-dark">• {item.label}</span>
                                        )}

                                        {item.count != null && (
                                            <div className="property-count">
                                                <AppLink href={item.href} className="text-decoration-none property-link" prefetch={false}>
                                                    ({item.count} properties)
                                                </AppLink>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
