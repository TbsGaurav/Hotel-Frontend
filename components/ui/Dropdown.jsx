

'use client';

import { useState } from 'react';
import Link from 'next/link';

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
        setIsOpen(prev => !prev);
    };

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
                                            <Link href={item.href} className="text-decoration-none text-dark" prefetch={false}>
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="text-dark">• {item.label}</span>
                                        )}

                                        {item.count != null && (
                                            <div className="property-count">
                                                <Link href={item.href} className="text-decoration-none property-link" prefetch={false}>
                                                    ({item.count} properties)
                                                </Link>
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