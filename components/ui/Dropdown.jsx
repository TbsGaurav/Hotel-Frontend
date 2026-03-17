'use client';

import Link from 'next/link';

export default function Dropdown({ id, title, items = [], parentId, defaultOpen = false }) {
    const headingId = `heading-${id}`;
    const collapseId = `collapse-${id}`;

    return (
        <div className="accordion mb-4" id={parentId}>
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id={headingId}>
                    <button
                        className={`accordion-button ${defaultOpen ? '' : 'collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={defaultOpen}
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
                    className={`accordion-collapse collapse ${defaultOpen ? 'show' : ''}`}
                    aria-labelledby={headingId}
                    data-bs-parent={`#${parentId}`}
                >
                    <div
                        className="accordion-body"
                        style={{
                            padding: '20px',
                            borderTop: 'none'
                        }}
                    >
                        <div className="row">
                            {items.length === 0 ? (
                                <div className="col-12 text-muted">No data found</div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={index} className="col-6 col-md-4 col-lg-3 mb-2">
                                        {item.href ? (
                                            <Link href={item.href} className="text-decoration-none text-dark" prefetch={false}>
                                                • {item.label}
                                            </Link>
                                        ) : (
                                            <span className="text-dark">• {item.label}</span>
                                        )}

                                        {item.count != null && (
                                            <div
                                                className="property-count"
                                                style={{ fontSize: '13px', marginLeft: '14px', lineHeight: '1.2' }}
                                            >
                                                <Link href="/" className="text-decoration-none property-link" prefetch={false}>
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
