'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';

export default function HotelDetails({ city, hotel, params }) {
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock hotel data - will be replaced with API call
    useEffect(() => {
        const loadHotel = async () => {
            try {
                setLoading(true);
                // Mock data for now
                setHotelData({
                    hotelName: hotel || 'Sample Hotel',
                    hotelAddress: '123 Main Street, City Center',
                    hotelDescription: 'Experience luxury at our hotel with stunning views, world-class amenities, and exceptional service. Located in the heart of the city, our property offers easy access to popular attractions, business districts, and entertainment venues.',
                    reviewScore: 8.5,
                    reviewCount: 1250,
                    stars: 4,
                    standardPhoto: '/image/property-img.webp',
                    thumbnailPhoto: '/image/property-img.webp',
                    hotelFacilities: 'Free WiFi, Air conditioning, Parking, Restaurant, Room service, Fitness center, Swimming pool, Spa, Bar, Concierge',
                    rooms: [
                        { name: 'Standard Room', price: 120, capacity: 2 },
                        { name: 'Deluxe Room', price: 180, capacity: 2 },
                        { name: 'Suite', price: 280, capacity: 4 },
                        { name: 'Family Room', price: 220, capacity: 4 }
                    ]
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [city, hotel]);

    function getRatingText(score) {
        if (score >= 9) return 'Exceptional';
        if (score >= 8) return 'Excellent';
        if (score >= 7) return 'Very good';
        if (score >= 6) return 'Good';
        return 'Pleasant';
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="skeleton-text mb-2" style={{ width: '150px', height: '20px' }}></div>
                <div className="skeleton-title" style={{ width: '300px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/" className="text-dark text-decoration-none">Home</Link>
                        <span className="mx-2 text-muted">•</span>
                        <Link href={`/${city}`} className="text-dark text-decoration-none">{city}</Link>
                        <span className="mx-2 text-muted">•</span>
                        <span className="fw-semibold text-decoration-none text-primary">{hotelData?.hotelName}</span>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <section className="container py-3">
                <div className="row g-2">
                    <div className="col-md-8">
                        <div
                            id="mainHotelCarousel"
                            className="carousel slide rounded-4 overflow-hidden"
                            data-bs-ride="carousel"
                            data-bs-interval="3000"
                        >
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#mainHotelCarousel" data-bs-slide-to="0" className="active"></button>
                                <button type="button" data-bs-target="#mainHotelCarousel" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#mainHotelCarousel" data-bs-slide-to="2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img
                                        src={hotelData?.standardPhoto || '/image/property-img.webp'}
                                        className="d-block w-100"
                                        style={{ height: '450px', objectFit: 'cover' }}
                                        alt={hotelData?.hotelName}
                                    />
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={hotelData?.thumbnailPhoto || '/image/property-img.webp'}
                                        className="d-block w-100"
                                        style={{ height: '450px', objectFit: 'cover' }}
                                        alt={hotelData?.hotelName}
                                    />
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src="/image/property-img.webp"
                                        className="d-block w-100"
                                        style={{ height: '450px', objectFit: 'cover' }}
                                        alt={hotelData?.hotelName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row g-2">
                            <div className="col-6 col-md-12">
                                <img
                                    src="/image/property-img.webp"
                                    className="rounded-4 w-100"
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    alt=""
                                />
                            </div>
                            <div className="col-6 col-md-12">
                                <img
                                    src="/image/property-img.webp"
                                    className="rounded-4 w-100"
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hotel Info */}
            <section className="container py-4">
                <div className="row">
                    <div className="col-lg-8">
                        {/* Title & Stars */}
                        <div className="d-flex align-items-center mb-3">
                            <h2 className="fw-bold mb-0 me-3">{hotelData?.hotelName}</h2>
                            <div className="text-warning">
                                {[...Array(5)].map((_, i) => (
                                    <MdOutlineStarPurple500
                                        key={i}
                                        size={20}
                                        color={i < hotelData?.stars ? "#f0831e" : "#ddd"}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <p className="text-muted mb-3">
                            <FaMapMarkerAlt className="me-2" />
                            {hotelData?.hotelAddress}
                        </p>

                        {/* Rating */}
                        <div className="d-flex align-items-center mb-4">
                            <div className="rating-box d-flex me-2" style={{ width: '50px', height: '50px', background: '#003580', borderRadius: '8px' }}>
                                <span className="m-auto text-white fw-bold">{hotelData?.reviewScore}</span>
                            </div>
                            <div>
                                <p className="mb-0 fw-bold">{getRatingText(hotelData?.reviewScore)}</p>
                                <p className="mb-0 text-muted small">{hotelData?.reviewCount?.toLocaleString()} reviews</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-2">About this property</h5>
                            <p className="text-muted">{hotelData?.hotelDescription}</p>
                        </div>

                        {/* Facilities/Amenities */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-3">Most Popular Facilities</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {hotelData?.hotelFacilities?.split(',').map((facility, idx) => (
                                    <span key={idx} className="badge bg-light text-dark border py-2 px-3">
                                        <i className="fa-solid fa-check text-success me-1"></i>
                                        {facility.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg rounded-4 p-4 sticky-top" style={{ top: '20px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <span className="fw-bold fs-4">$120</span>
                                    <span className="text-muted"> / night</span>
                                </div>
                                <div className="text-warning">
                                    <MdOutlineStarPurple500 size={16} color="#f0831e" />
                                    <span className="text-dark ms-1">4.5</span>
                                </div>
                            </div>

                            <div className="border rounded mb-3 p-2">
                                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                    <div>
                                        <p className="mb-0 fw-bold small">CHECK-IN</p>
                                        <p className="mb-0">Add date</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="mb-0 fw-bold small">CHECKOUT</p>
                                        <p className="mb-0">Add date</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="mb-0 fw-bold small">Guests</p>
                                        <p className="mb-0">2 adults</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="mb-0 fw-bold small">Rooms</p>
                                        <p className="mb-0">1 room</p>
                                    </div>
                                </div>
                            </div>

                            <button className="theme-button-blue rounded w-100 py-3 fw-bold mb-2">
                                See Availability
                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>

                            <p className="text-center text-muted small mb-0">
                                <i className="fa-solid fa-lock me-1"></i>
                                We don&apos;t charge any booking fees
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section className="container py-4">
                <h3 className="fw-bold mb-4">Available Rooms</h3>
                <div className="row">
                    {hotelData?.rooms?.map((room, idx) => (
                        <div key={idx} className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold">{room.name}</h5>
                                        <p className="text-muted mb-2">
                                            <FaUser className="me-1" /> Up to {room.capacity} guests
                                        </p>
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-success-subtle text-success"><i className="fa-solid fa-wifi me-1"></i> Free WiFi</span>
                                            <span className="badge bg-success-subtle text-success"><i className="fa-solid fa-snowflake me-1"></i> A/C</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <span className="fw-bold fs-4">${room.price}</span>
                                        <p className="text-muted small">per night</p>
                                        <button className="theme-button-blue rounded px-3 py-1">Select</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
