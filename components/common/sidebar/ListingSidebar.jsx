'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
 
function normalizeLabel(item) {
    return String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
}
 
function normalizeKey(item, label) {
    return String(item?.categoryId ?? item?.id ?? item?.value ?? label).trim();
}

function normalizeHref(item, label) {
    if (item?.href) {
        if (typeof item.href === 'string') return item.href;

        const pathname = item.href?.pathname || '';
        const query = item.href?.query || {};

        if (pathname && pathname.includes('[city]') && pathname.includes('[category]')) {
            const city = query.city || '';
            const category = query.category || '';
            const categoryId = query.categoryId;
            const search = new URLSearchParams();

            if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
                search.set('categoryId', String(categoryId));
            }

            return `/city/${encodeURIComponent(city)}/${encodeURIComponent(category)}${search.toString() ? `?${search.toString()}` : ''}`;
        }

        return pathname || '#';
    }

    const raw = item?.categoryUrlName || item?.urlName || label;
    if (!raw) return '#';
    return `#${String(raw).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function LinkRow({ label, href, isActive = false, onClick = null, item = null }) {
    const className = [
        'sidebar-filter-link d-flex align-items-start gap-2 w-100 text-start',
        isActive ? 'active fw-semibold' : ''
    ]
        .filter(Boolean)
        .join(' ');

    const storeSelectionContext = () => {
        if (typeof window === 'undefined') return;

        try {
            const categoryId = item?.categoryId ?? item?.CategoryId ?? item?.id ?? null;
            const regionId = item?.regionId ?? item?.RegionId ?? null;
            const countrySlug = item?.countrySlug ?? item?.country ?? null;

            if (categoryId || regionId || countrySlug) {
                const payload = JSON.stringify({
                    categoryId,
                    regionId,
                    countrySlug,
                    href
                });
                sessionStorage.setItem('listingCategoryContext', payload);
                document.cookie = `listingCategoryContext=${encodeURIComponent(payload)}; path=/; max-age=120; SameSite=Lax`;
            }
        } catch (error) {
            console.error('Unable to store listing context:', error);
        }
    };

    return (
        <li className="sidebar-filter-item">
            <Link
                href={href}
                className={className}
                onMouseDown={storeSelectionContext}
                onClick={(event) => {
                    if (typeof onClick === 'function') {
                        event.preventDefault();
                        storeSelectionContext();
                        onClick(event);
                        return;
                    }
                    storeSelectionContext();
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        storeSelectionContext();
                    }
                }}
                style={
                    isActive
                        ? {
                              background: 'rgba(240, 131, 30, 0.12)',
                              color: '#c55f00',
                              borderRadius: '10px',
                              padding: '8px 10px'
                          }
                        : { padding: '8px 10px' }
                }
            >
                <span className="sidebar-filter-text">{label}</span>
            </Link>
        </li>
    );
}

export function PriceRangeBlock() {
    return (
        <div className="px-3 pt-3 pb-3 border-bottom">
            <h6 className="fw-semibold mb-2" style={{ fontSize: '15px' }}>
                Price Range
            </h6>
            <p className="small text-muted mb-2">AUD 100 to AUD 600</p>
            <div className="position-relative" style={{ height: '6px', background: '#d9dee7', borderRadius: '999px' }}>
                <div
                    style={{
                        position: 'absolute',
                        left: '22%',
                        width: '44%',
                        height: '100%',
                        background: '#f0831e',
                        borderRadius: '999px'
                    }}
                />
            </div>
            <div className="position-relative" style={{ height: '18px', marginTop: '-12px' }}>
                <span
                    style={{
                        position: 'absolute',
                        left: '22%',
                        width: '18px',
                        height: '18px',
                        background: '#f0831e',
                        borderRadius: '50%',
                        transform: 'translateX(-50%)'
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: '66%',
                        width: '18px',
                        height: '18px',
                        background: '#f0831e',
                        borderRadius: '50%',
                        transform: 'translateX(-50%)'
                    }}
                />
            </div>
        </div>
    );
}
 
function SectionBlock({ title, items = [], maxVisible = 5, defaultOpen = true, emptyText = 'No items available' }) {
    const [showMore, setShowMore] = useState(false);
 
    const normalizedItems = useMemo(() => {
        const seen = new Set();
        return (Array.isArray(items) ? items : []).filter((item) => {
            const label = normalizeLabel(item).toLowerCase();
            if (!label || seen.has(label)) return false;
            seen.add(label);
            return true;
        });
    }, [items]);
 
    const visibleItems = showMore ? normalizedItems : normalizedItems.slice(0, maxVisible);
    const hasMore = normalizedItems.length > maxVisible;
 
    return (
        <section className="sidebar-filter-section border-bottom">
            <div className="px-3 pt-3 pb-2 d-flex align-items-start justify-content-between">
                <h4 className="sidebar-section-title mb-0">{title}</h4>
            </div>

            <div className="px-3 pb-3">
                {visibleItems.length > 0 ? (
                    <ul className="sidebar-filter-list mb-0">
                        {visibleItems.map((item) => {
                            const label = normalizeLabel(item);
                            const key = normalizeKey(item, label);
                            const href = normalizeHref(item, label);
                            const isActive = Boolean(item?.isActive);

                            return (
                                <LinkRow
                                    key={key || label}
                                    label={label}
                                    href={href}
                                    isActive={isActive}
                                    onClick={item?.onClick}
                                    item={item}
                                />
                            );
                        })}
                    </ul>
                ) : (
                    <div className="sidebar-empty-state">{emptyText}</div>
                )}

                {hasMore && (
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 mt-1 sidebar-show-more"
                        onClick={() => setShowMore((prev) => !prev)}
                    >
                        {showMore ? 'show less' : '+show more'}
                    </button>
                )}
            </div>
        </section>
    );
}
 
export default function ListingSidebar({
    title = 'Filters',
    topContent = null,
    sections = []
}) {
    return (
        <aside
            className="bg-white rounded-4 overflow-hidden"
            style={{
                boxShadow: '0 2px 14px rgba(15, 23, 42, 0.08)',
                border: '1px solid #eceff3'
            }}
        >
            <div className="px-3 py-3 border-bottom">
                <div className="fw-bold" style={{ fontSize: '17px', color: '#111827' }}>
                    {title}
                </div>
            </div>
 
            {topContent}
 
            <div>
                {sections.map((section) => (
                    <SectionBlock
                        key={section.displayTitle || section.title}
                        title={section.displayTitle || section.title}
                        items={section.items}
                        maxVisible={section.maxVisible ?? 5}
                        defaultOpen={section.defaultOpen ?? true}
                        emptyText={section.emptyText}
                    />
                ))}
            </div>
        </aside>
    );
}
