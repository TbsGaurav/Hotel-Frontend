'use client';

import { useMemo, useState } from 'react';
import { buildCategoryListingPath } from '@/lib/api/public/cityCategoryapi';
import AppLink from '../AppLink';

function normalizeLabel(item) {
    if (item?.collectionName) {
        return item.collectionName;
    }
    return String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
}

export function getVisibleSidebarSections(sections = []) {
    const normalizedSections = Array.isArray(sections) ? sections : [];

    return normalizedSections.filter((section) => {
        if (section?.alwaysShow) return true;

        const items = Array.isArray(section?.items) ? section.items : [];
        const seen = new Set();

        for (const item of items) {
            const label = normalizeLabel(item).toLowerCase();
            if (!label || seen.has(label)) continue;
            seen.add(label);
            return true;
        }

        return false;
    });
}

function normalizeKey(item, label) {
    if (item?.collectionId) {
        return `collection-${item.collectionId}`;
    }
    return String(item?.categoryId ?? item?.id ?? item?.value ?? label).trim();
}

function normalizeHref(item, label, context = {}) {
    if (item?.collectionSlug) {
        return `/${item.collectionSlug}`;
    }

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

            if (context.regionId) {
                search.set('regionId', String(context.regionId));
            }
            if (context.countrySlug) {
                search.set('country', String(context.countrySlug));
            }

            const basePath = buildCategoryListingPath(city, category);
            const queryString = search.toString();
            return `${basePath}${queryString ? `?${queryString}` : ''}`;
        }

        return pathname || '#';
    }

    const raw = item?.categoryUrlName || item?.urlName || item?.href || label;
    if (!raw) return '#';

    const isAbsolutePath = raw.startsWith('/') || raw.startsWith('http');
    if (isAbsolutePath) {
        return raw;
    }

    const baseUrl = `${String(raw)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`;

    if (context.regionId && context.countrySlug) {
        const searchParams = new URLSearchParams();
        searchParams.set('regionId', String(context.regionId));
        searchParams.set('country', context.countrySlug);
        return `${baseUrl}?${searchParams.toString()}`;
    }

    return baseUrl;
}

function LinkRow({ label, href, isActive = false, onClick = null, item = null, context = {} }) {
    const className = ['sidebar-filter-link d-flex align-items-start gap-2 w-100 text-start', isActive ? 'active' : '']
        .filter(Boolean)
        .join(' ');

    const storeSelectionContext = () => {
        if (typeof window === 'undefined') return;

        try {
            const categoryId = item?.categoryId ?? item?.CategoryId ?? item?.id ?? null;
            const regionId = context.regionId || (item?.regionId ?? item?.RegionId ?? null);
            const countrySlug = context.countrySlug || (item?.countrySlug ?? item?.country ?? null);

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
        <li className="para-12px mb-2">
            <AppLink
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
                              color: '#0077C0',
                              fontWeight: '400 !important'
                          }
                        : { padding: '0px 0px' }
                }
            >
                <span className="sidebar-filter-text">{label}</span>
            </AppLink>
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
            <div className="position-relative min-height-6">
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
function SectionBlock({ title, items = [], maxVisible = 5, emptyText = 'No items available', context = {} }) {
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

            <div className="px-3 pb-3 pt-2">
                {visibleItems.length > 0 ? (
                    <ul className="sidebar-filter-list ps-3 mb-0">
                        {visibleItems.map((item) => {
                            const label = normalizeLabel(item);
                            const key = normalizeKey(item, label);
                            const href = normalizeHref(item, label, context);
                            const isActive = Boolean(item?.isActive);

                            return (
                                <LinkRow
                                    key={key || label}
                                    label={label}
                                    href={href}
                                    isActive={isActive}
                                    onClick={item?.onClick}
                                    item={item}
                                    context={context}
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
                        className="btn btn-link text-decoration-none p-0 mt-1 sidebar-show-more ps-3"
                        onClick={() => setShowMore((prev) => !prev)}
                    >
                        {showMore ? 'show less' : '+ show more'}
                    </button>
                )}
            </div>
        </section>
    );
}

export default function ListingSidebar({ title = 'Filters', topContent = null, sections = [], regionContext = {} }) {
    const visibleSections = useMemo(() => getVisibleSidebarSections(sections), [sections]);

    if (visibleSections.length === 0 && !topContent) {
        return null;
    }

    return (
        <aside className="bg-white rounded-4 overflow-hidden shadow">
            <div className="px-3 py-3 border-bottom">
                <div className="fw-bold font-size-17">{title}</div>
            </div>

            {topContent}

            <div>
                {visibleSections.map((section) => (
                    <SectionBlock
                        key={section.displayTitle || section.title}
                        title={section.displayTitle || section.title}
                        items={section.items}
                        maxVisible={section.maxVisible ?? 5}
                        defaultOpen={section.defaultOpen ?? true}
                        emptyText={section.emptyText}
                        context={regionContext}
                    />
                ))}
            </div>
        </aside>
    );
}
