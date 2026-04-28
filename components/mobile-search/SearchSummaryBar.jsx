'use client';

export default function SearchSummaryBar({ children }) {
  return (
    <div
      className="sticky-top w-100 mx-auto mobile-search-panel"
      style={{
        zIndex: 1040
      }}
    >
      {children}
    </div>
  );
}
