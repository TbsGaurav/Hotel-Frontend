'use client';
 
import { useMemo, useState } from 'react';
 
function normalizeLabel(item) {
    return String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
}
 
function normalizeKey(item, label) {
    return String(item?.categoryID ?? item?.id ?? item?.value ?? label).trim();
}
 
function normalizeHref(item, label) {
    const raw = item?.categoryUrlName || item?.urlName || label;
    if (!raw) return '#';
    return `#${String(raw).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}
 
function CheckboxRow({ label, href, checked, onToggle }) {
    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                onToggle?.(label);
            }}
            className="d-flex align-items-center gap-2 text-decoration-none"
            style={{ color: '#111827' }}
        >
            <span
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    border: '1px solid #cbd5e1',
                    background: checked ? '#2f80ed' : '#fff',
                    boxShadow: checked ? 'inset 0 0 0 2px #fff' : 'none',
                    flex: '0 0 16px'
                }}
            />
            <span style={{ fontSize: '13px', lineHeight: 1.2 }}>{label}</span>
        </a>
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
 
function SectionBlock({ title, items = [], selectedValues, setSelectedValues, maxVisible = 5, defaultOpen = true, emptyText = 'No items available' }) {
    const [open, setOpen] = useState(defaultOpen);
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
 
    const toggleLabel = (label) => {
        const key = String(label || '').trim().toLowerCase();
        if (!key) return;
 
        setSelectedValues((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };
 
    return (
        <section className="border-bottom">
            <button
                type="button"
                className="w-100 border-0 bg-white px-3 py-3 d-flex align-items-center justify-content-between"
                onClick={() => setOpen((prev) => !prev)}
                style={{ outline: 'none' }}
            >
                <span className="fw-semibold" style={{ color: '#111827', fontSize: '15px' }}>
                    {title}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '18px', lineHeight: 1 }}>{open ? '^' : 'v'}</span>
            </button>
 
            {open && (
                <div className="px-3 pb-3">
                    {visibleItems.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                            {visibleItems.map((item) => {
                                const label = normalizeLabel(item);
                                const key = normalizeKey(item, label);
                                const href = normalizeHref(item, label);
                                const checked = selectedValues?.has(label.toLowerCase());
 
                                return <CheckboxRow key={key || label} label={label} href={href} checked={checked} onToggle={toggleLabel} />;
                            })}
                        </div>
                    ) : (
                        <div className="text-muted small py-1">{emptyText}</div>
                    )}
 
                    {hasMore && (
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0 mt-2"
                            onClick={() => setShowMore((prev) => !prev)}
                            style={{ color: '#2f80ed', fontSize: '13px' }}
                        >
                            {showMore ? 'show less' : '+show more'}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
 
export default function ListingSidebar({
    title = 'Filters',
    topContent = <PriceRangeBlock />,
    sections = [],
    chipLimit,
    initialSelectedValues = []
}) {
    const [selectedValues, setSelectedValues] = useState(() => new Set(initialSelectedValues.map((value) => String(value).trim().toLowerCase()).filter(Boolean)));
    const chips = chipLimit ? Array.from(selectedValues).slice(0, chipLimit) : Array.from(selectedValues);
 
    const clearAll = () => setSelectedValues(new Set());
 
    return (
        <aside
            className="bg-white rounded-4 overflow-hidden"
            style={{
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e5e7eb'
            }}
        >
            <div className="px-3 py-3 d-flex align-items-center justify-content-between border-bottom">
                <div className="fw-bold" style={{ fontSize: '16px', color: '#111827' }}>
                    {title}
                </div>
                <button type="button" className="btn btn-link text-decoration-none p-0" onClick={clearAll} style={{ color: '#111827', fontSize: '13px' }}>
                    Clear
                </button>
            </div>
 
            {chips.length > 0 && (
                <div className="px-3 pt-3">
                    <div className="d-flex flex-wrap gap-2">
                        {chips.map((item) => (
                            <span
                                key={item}
                                className="badge d-inline-flex align-items-center gap-2"
                                style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 500, padding: '0.45rem 0.6rem' }}
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedValues((prev) => {
                                            const next = new Set(prev);
                                            next.delete(item);
                                            return next;
                                        })
                                    }
                                    className="btn btn-sm p-0 border-0"
                                    style={{ lineHeight: 1, color: '#1d4ed8' }}
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
 
            {topContent}
 
            <div className="mt-0">
                {sections.map((section) => (
                    <SectionBlock
                        key={section.title}
                        title={section.title}
                        items={section.items}
                        selectedValues={selectedValues}
                        setSelectedValues={setSelectedValues}
                        maxVisible={section.maxVisible ?? 5}
                        defaultOpen={section.defaultOpen ?? true}
                        emptyText={section.emptyText}
                    />
                ))}
            </div>
        </aside>
    );
}
