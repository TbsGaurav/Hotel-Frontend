'use client';
export default function HotelCard({ image, name, location, rating, reviews, oldPrice, price, features, taxesInfo }) {
  const ratingLabel = Number(rating) >= 4.5 ? 'Excellent' : 'Very Good';

  return (
    <div className="d-flex gap-2 bg-white p-2 rounded-4 border shadow-sm w-100 mx-auto mb-2 overflow-hidden position-relative" style={{ maxWidth: '480px' }}>
      <div className="flex-shrink-0 position-relative rounded-3 overflow-hidden bg-light" style={{ width: '110px', aspectRatio: '3/4' }}>
        <img 
          src={image} 
          alt={name} 
          className="d-block w-100 h-100"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
        <button 
          className="btn btn-sm position-absolute d-flex align-items-center justify-content-center rounded-circle"
          style={{ top: '6px', right: '6px', width: '28px', height: '28px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff', zIndex: 1 }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>

      <div className="d-flex flex-column flex-grow-1 py-1 justify-content-between overflow-hidden pe-1">
        <div>
          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '14px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</h6>
          <p className="text-muted mb-0 text-truncate mt-1" style={{ fontSize: '11px' }}>{location}</p>

          <div className="d-flex align-items-center gap-1 mt-1">
            <span className="d-inline-flex align-items-center justify-content-center text-white fw-bold rounded" style={{ background: '#003b95', fontSize: '10px', padding: '2px 5px' }}>
              {rating}
            </span>
            <span className="fw-medium text-dark" style={{ fontSize: '11px' }}>{ratingLabel}</span>
            <span className="text-muted" style={{ fontSize: '11px' }}>{reviews} reviews</span>
          </div>

          {features && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {features.map((feat, i) => (
                <span key={i} className="badge rounded border fw-medium text-nowrap" style={{ fontSize: '10px', background: '#f0fdf4', color: '#166534', borderColor: '#dcfce7', padding: '2px 6px' }}>
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 d-flex flex-column align-items-end">
          <div className="d-flex align-items-baseline gap-1">
            {oldPrice && <span className="text-muted text-decoration-line-through" style={{ fontSize: '12px' }}>₹{oldPrice}</span>}
            <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>₹{price}</span>
          </div>
          <p className="text-muted mb-0 mt-0" style={{ fontSize: '10px' }}>{taxesInfo || '+₹450 taxes and charges'}</p>
        </div>
      </div>
    </div>
  );
}
