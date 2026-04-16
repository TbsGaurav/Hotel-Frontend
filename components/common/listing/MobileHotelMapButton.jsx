'use client';

export default function MobileHotelMapButton({ label = 'Map' }) {
    return (
        <button
            type="button"
            className="mobile-actions__link"
            onClick={() => {
                if (typeof window === 'undefined') return;
                window.dispatchEvent(new CustomEvent('hotel-map-toggle'));
            }}
        >
            {label}
        </button>
    );
}

