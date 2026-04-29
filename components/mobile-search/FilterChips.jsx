'use client';
export default function FilterChips({ onFilterClick }) {
  const chips = ['Popular', 'Price', 'Guest rating', 'Star rating'];

  return (
    <div className="d-flex overflow-auto gap-2 px-3 py-2 mt-1 mb-1 w-100 mx-auto" style={{ maxWidth: '480px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <button 
        onClick={onFilterClick}
        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 text-nowrap rounded shadow-sm fw-medium"
        style={{ fontSize: '12px', padding: '5px 10px' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
        Sort &amp; Filter
      </button>
      {chips.map(chip => (
        <button
          key={chip}
          className="btn btn-sm btn-outline-light text-secondary border text-nowrap fw-medium"
          style={{ fontSize: '12px', padding: '5px 10px' }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
