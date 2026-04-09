import Image from 'next/image';
import { useId } from 'react';

export default function  HotelCard({ hotel }) {
    const carouselId = useId();

    return (
        <div className="property-grid-box p-3 bg-white border-radius-10px">
            {/* Image Carousel */}
            <div id={`carousel-${carouselId}`} className="carousel slide position-relative" data-bs-ride="carousel" data-bs-interval="2000">
                {/* Indicators INSIDE image */}
                <div className="carousel-indicators custom-indicators">
                    {hotel.images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            data-bs-target={`#carousel-${carouselId}`}
                            data-bs-slide-to={i}
                            className={i === 0 ? 'active' : ''}
                        />
                    ))}
                </div>

                <div className="carousel-inner rounded-3 overflow-hidden">
                    {hotel.images.map((img, i) => (
                        <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                            <Image
                                src={img}
                                className="d-block w-100"
                                alt="hotel"
                                style={{
                                    height: '220px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="pt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="property-grid-title mb-0">{hotel.name}</h5>

                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star text-warning"></i>
                        ))}
                    </div>
                </div>

                <p className="small-para-14-px mb-3">{hotel.address}</p>

                <button className="theme-button-blue w-100" style={{ borderRadius: '4px' }}>
                    More Info
                </button>
            </div>
        </div>
    );
}
