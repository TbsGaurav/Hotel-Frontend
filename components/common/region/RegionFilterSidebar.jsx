'use client';

import { useEffect, useRef, useState } from 'react';
import { MdOutlineStarPurple500 } from 'react-icons/md';

export default function RegionFilterSidebar() {
    const [priceRange, setPriceRange] = useState({
        min: 100,
        max: 600
    });
    const [isSliding, setIsSliding] = useState(null);
    const datePickerRef = useRef(null);

    const MIN_PRICE = 0;
    const MAX_PRICE = 1000;

    const handleSliderMouseUp = () => {
        setIsSliding(null);
        setPriceRange({ ...priceRange });
    };
    const handleSliderMouseDown = (type) => {
        setIsSliding(type);
    };
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target) &&
                !event.target.closest('.react-datepicker') &&
                !event.target.closest('.country-date-range-picker-popup ')
            ) {
                setShowDatePicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.userSelect = isSliding ? 'none' : 'auto';
    }, [isSliding]);
    const valueToPercent = (value) => ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isSliding) return;

            const slider = document.getElementById('price-slider-track');
            const rect = slider.getBoundingClientRect();

            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));

            const value = Math.round(MIN_PRICE + (percent / 100) * (MAX_PRICE - MIN_PRICE));

            if (isSliding === 'min' && value <= priceRange.max) {
                setPriceRange((prev) => ({ ...prev, min: value }));
            }
            if (isSliding === 'max' && value >= priceRange.min) {
                setPriceRange((prev) => ({ ...prev, max: value }));
            }
        };

        const handleMouseUp = () => {
            if (isSliding) {
                setPriceRange({ ...priceRange });
                setIsSliding(null);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isSliding, priceRange]);
    return (
        <div
            className="bg-white rounded-4 p-4"
            style={{
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                fontSize: '14px'
            }}
        >
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-semibold">Filters</h5>
                <button
                    className="btn btn-link p-0"
                    style={{
                        fontSize: '14px',
                        color: '#0d6efd',
                        textDecoration: 'none'
                    }}
                >
                    Clear
                </button>
            </div>

            {/* SELECTED FILTER CHIP */}
            <div className="mb-3">
                <span
                    className="badge d-inline-flex align-items-center"
                    style={{
                        background: '#e9f2fb',
                        color: '#000',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontWeight: 500
                    }}
                >
                    5 star <span className="ms-1">×</span>
                </span>
            </div>

            {/* PRICE RANGE */}
            <div className="pb-3 mb-3 border-bottom">
                <h6 className="fw-semibold mb-2">Price Range</h6>

                <p className="small text-muted mb-2">
                    AUD {priceRange.min} to AUD {priceRange.max}
                </p>
                <div
                    id="price-slider-track"
                    className="slider-track position-relative"
                    style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px' }}
                >
                    <div
                        className="slider-selected"
                        style={{
                            position: 'absolute',
                            height: '100%',
                            background: '#f0831e',
                            left: `${valueToPercent(priceRange.min)}%`,
                            width: `${valueToPercent(priceRange.max) - valueToPercent(priceRange.min)}%`
                        }}
                    />
                </div>
                <div className="position-relative" style={{ height: '20px', marginTop: '-13px' }} onMouseUp={handleSliderMouseUp}>
                    <div
                        onMouseDown={() => handleSliderMouseDown('min')}
                        style={{
                            position: 'absolute',
                            left: `${valueToPercent(priceRange.min)}%`,
                            width: '20px',
                            height: '20px',
                            background: '#f0831e',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            cursor: 'pointer'
                        }}
                        title={`AUD ${priceRange.min}`}
                        tabIndex={0}
                    />
                    <div
                        onMouseDown={() => handleSliderMouseDown('max')}
                        style={{
                            position: 'absolute',
                            left: `${valueToPercent(priceRange.max)}%`,
                            width: '20px',
                            height: '20px',
                            background: '#f0831e',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            cursor: 'pointer'
                        }}
                        title={`AUD ${priceRange.max}`}
                        tabIndex={0}
                    />
                </div>
                {/* <div
                    className="position-relative"
                    style={{
                        height: '4px',
                        background: '#d6d6d6',
                        borderRadius: '4px'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            height: '100%',
                            background: '#f0831e',
                            left: `${valueToPercent(priceRange.min)}%`,
                            width: `${valueToPercent(priceRange.max) - valueToPercent(priceRange.min)}%`
                        }}
                    />
                </div> */}
            </div>

            {/* RATING */}
            {/* <div className="pb-3 mb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Rating</h6>
                    <IoChevronUpOutline size={16} color="#777" />
                </div>

                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="form-check mb-2 d-flex align-items-center">
                        <input className="form-check-input me-2" type="checkbox" />

                        <label className="form-check-label d-flex gap-1">
                            {[...Array(rating)].map((_, i) => (
                                <MdOutlineStarPurple500 key={i} size={18} color="#f0831e" />
                            ))}
                        </label>
                    </div>
                ))}

                <div className="form-check">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Unrated Property</label>
                </div>
            </div> */}
            <div className="pb-3 mb-3 border-bottom">
                <div
                    className="d-flex justify-content-between align-items-center"
                    data-bs-toggle="collapse"
                    data-bs-target="#ratingCollapse"
                    style={{ cursor: 'pointer' }}
                >
                    <h6 className="fw-semibold mb-0">Rating</h6>
                    <i className="bi bi-chevron-down text-muted"></i>
                </div>

                <div className="collapse show mt-3" id="ratingCollapse">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="form-check mb-2 d-flex align-items-center">
                            <input className="form-check-input me-2" type="checkbox" />

                            <label className="form-check-label">
                                {[...Array(rating)].map((_, i) => (
                                    <MdOutlineStarPurple500 key={i} size={18} color="#f0831e" />
                                ))}
                            </label>
                        </div>
                    ))}

                    <div className="form-check">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Unrated Property</label>
                    </div>
                </div>
            </div>
            {/* PROPERTY TYPE */}
            {/* <div className="pb-3 mb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Property Type</h6>
                    <IoChevronUpOutline size={16} color="#777" />
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">2 bedroom apartments</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">3 bedroom apartments</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Airport Shuttle</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">All Serviced Apartments</label>
                </div>

                <button className="btn btn-link p-0 small">+show more</button>
            </div> */}
            <div className="pb-3 mb-3 border-bottom">
                <div
                    className="d-flex justify-content-between align-items-center"
                    data-bs-toggle="collapse"
                    data-bs-target="#propertyCollapse"
                    style={{ cursor: 'pointer' }}
                >
                    <h6 className="fw-semibold mb-0">Property Type</h6>
                    <i className="bi bi-chevron-down text-muted"></i>
                </div>

                <div className="collapse show mt-3" id="propertyCollapse">
                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">2 bedroom apartments</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">3 bedroom apartments</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Airport Shuttle</label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">All Serviced Apartments</label>
                    </div>

                    <button className="btn btn-link p-0 small mt-1">+show more</button>
                </div>
            </div>
            {/* FACILITIES */}
            {/* <div className="pb-3 mb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Facilities</h6>
                    <IoChevronUpOutline size={16} color="#777" />
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Conference facilities</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Free WiFi Internet Access</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Parking</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Day Spa</label>
                </div>

                <button className="btn btn-link p-0 small">+show more</button>
            </div> */}
            <div className="pb-3 mb-3 border-bottom">
                <div
                    className="d-flex justify-content-between align-items-center"
                    data-bs-toggle="collapse"
                    data-bs-target="#facilityCollapse"
                    style={{ cursor: 'pointer' }}
                >
                    <h6 className="fw-semibold mb-0">Facilities</h6>
                    <i className="bi bi-chevron-down text-muted"></i>
                </div>

                <div className="collapse show mt-3" id="facilityCollapse">
                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Conference facilities</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Free WiFi Internet Access</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Parking</label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Day Spa</label>
                    </div>

                    <button className="btn btn-link p-0 small mt-1">+show more</button>
                </div>
            </div>
            {/* ENTERTAINMENT */}
            {/* <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Entertainment</h6>
                    <IoChevronUpOutline size={16} color="#777" />
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Barbeque BBQ</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Casino</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Golf Course</label>
                </div>

                <div className="form-check mb-2">
                    <input className="form-check-input me-2" type="checkbox" />
                    <label className="form-check-label">Gym</label>
                </div>

                <button className="btn btn-link p-0 small">+show more</button>
            </div> */}
            <div>
                <div
                    className="d-flex justify-content-between align-items-center"
                    data-bs-toggle="collapse"
                    data-bs-target="#entertainCollapse"
                    style={{ cursor: 'pointer' }}
                >
                    <h6 className="fw-semibold mb-0">Entertainment</h6>
                    <i className="bi bi-chevron-down text-muted"></i>
                </div>

                <div className="collapse show mt-3" id="entertainCollapse">
                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Barbeque BBQ</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Casino</label>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Golf Course</label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input me-2" type="checkbox" />
                        <label className="form-check-label">Gym</label>
                    </div>

                    <button className="btn btn-link p-0 small mt-1">+show more</button>
                </div>
            </div>
        </div>
    );
}

// 'use client';

// import { useState } from 'react';
// import { MdOutlineStarPurple500 } from 'react-icons/md';

// export default function RegionFilterSidebar() {
//     const [priceRange, setPriceRange] = useState({
//         min: 100,
//         max: 400
//     });

//     const MIN_PRICE = 0;
//     const MAX_PRICE = 1000;

//     const valueToPercent = (value) => ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

//     return (
//         <div className="border rounded p-4 bg-light">
//             {/* PRICE RANGE */}
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-2">Price Range</h5>

//                 <p className="small">
//                     AUD {priceRange.min} to AUD {priceRange.max}
//                 </p>

//                 <div
//                     id="price-slider-track"
//                     className="position-relative"
//                     style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px' }}
//                 >
//                     <div
//                         style={{
//                             position: 'absolute',
//                             height: '100%',
//                             background: '#f0831e',
//                             left: `${valueToPercent(priceRange.min)}%`,
//                             width: `${valueToPercent(priceRange.max) - valueToPercent(priceRange.min)}%`
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* RATING */}
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-2">Rating</h5>

//                 {[5, 4, 3, 2, 1].map((rating) => (
//                     <div className="form-check d-flex mb-2" key={rating}>
//                         <input className="form-check-input me-2" type="checkbox" />
//                         <label className="form-check-label">
//                             {[...Array(rating)].map((_, i) => (
//                                 <MdOutlineStarPurple500 key={i} size={18} />
//                             ))}
//                         </label>
//                     </div>
//                 ))}

//                 <div className="form-check">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Unrated Property</label>
//                 </div>
//             </div>

//             {/* PROPERTY TYPE */}
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-2">Property Type</h5>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>2 bedroom apartments</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>3 bedroom apartments</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Airport Shuttle</label>
//                 </div>

//                 <div className="form-check">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>All Serviced Apartments</label>
//                 </div>

//                 <div className="mt-2">
//                     <a href="#" className="small text-primary">
//                         +show more
//                     </a>
//                 </div>
//             </div>

//             {/* FACILITIES */}
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-2">Facilities</h5>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Conference facilities</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Free WiFi Internet Access</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Parking</label>
//                 </div>

//                 <div className="form-check">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Day Spa</label>
//                 </div>

//                 <div className="mt-2">
//                     <a href="#" className="small text-primary">
//                         +show more
//                     </a>
//                 </div>
//             </div>

//             {/* ENTERTAINMENT */}
//             <div>
//                 <h5 className="fw-semibold mb-2">Entertainment</h5>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Barbeque BBQ</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Casino</label>
//                 </div>

//                 <div className="form-check mb-2">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Golf Course</label>
//                 </div>

//                 <div className="form-check">
//                     <input className="form-check-input me-2" type="checkbox" />
//                     <label>Gym</label>
//                 </div>

//                 <div className="mt-2">
//                     <a href="#" className="small text-primary">
//                         +show more
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// }
