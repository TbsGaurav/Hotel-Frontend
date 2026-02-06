'use client';

import Link from 'next/link';

export default function Dropdown({ id, title, items = [], parentId }) {
    const headingId = `heading-${id}`;
    const collapseId = `collapse-${id}`;

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={headingId}>
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                >
                    {title}
                </button>
            </h2>

            <div id={collapseId} className="accordion-collapse collapse" aria-labelledby={headingId} data-bs-parent={`#${parentId}`}>
                <div className="accordion-body">
                    <div className="row">
                        {items.map((item, index) => (
                            <div key={index} className="col-6 col-md-3 mb-2 fw-semibold">
                                {item.href ? (
                                    <Link href={item.href} className="text-decoration-none d-block">
                                        <div className="fw-semibold text-dark">• {item.label}</div>
                                        {item.count != null && (
                                            <div
                                                className="text-secondary small"
                                                style={{
                                                    fontSize: '13px',
                                                    marginLeft: '14px',
                                                    marginTop: '2px',
                                                    lineHeight: '1.2'
                                                }}
                                            >
                                                ({item.count} properties)
                                            </div>
                                        )}
                                    </Link>
                                ) : (
                                    <>
                                        <div className="fw-semibold">• {item.label}</div>
                                        {item.count != null && (
                                            <div
                                                className="text-primary small"
                                                style={{
                                                    fontSize: '13px',
                                                    marginLeft: '14px',
                                                    marginTop: '2px',
                                                    lineHeight: '1.2'
                                                }}
                                            >
                                                ({item.count} properties)
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
