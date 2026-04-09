'use client';

const renderStars = (stars) => {
    if (stars === null || stars === undefined || stars === '') return '';

    const numericStars = Number(stars);

    if (Number.isFinite(numericStars) && numericStars > 0) {
        return '⭐'.repeat(Math.min(5, Math.round(numericStars)));
    }

    return String(stars);
};

export default function HotelRowInfo({ name, stars, address, reviewScore }) {
    const starsText = renderStars(stars);

    return (
        <div className="hotel-row-info">
            <span className="hotel-name" title={name}>
                {name}
            </span>

            {starsText ? (
                <>
                    <span className="hotel-separator">|</span>
                    <span className="hotel-stars" title={String(stars)}>
                        {starsText}
                    </span>
                </>
            ) : null}

            {address ? (
                <>
                    <span className="hotel-separator">|</span>
                    <span className="hotel-address" title={address}>
                        {address}
                    </span>
                </>
            ) : null}

            {reviewScore !== null && reviewScore !== undefined && reviewScore !== '' ? (
                <>
                    <span className="hotel-separator">|</span>
                    <span className="hotel-score" title={String(reviewScore)}>
                        {reviewScore}
                    </span>
                </>
            ) : null}
        </div>
    );
}
