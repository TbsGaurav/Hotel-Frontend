'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaCamera, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';

export default function HotelDetails({ initialData }) {
    const [hotelData] = useState(initialData);
    const loading = !initialData;
    const [error, setError] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [timestamp, setTimestamp] = useState('');

    // Default image path
    const defaultImage = '/image/property-img.webp';

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimestamp(Date.now().toString());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Generate cache-busted URL
    const getImageUrl = (photo) => {
        if (!photo) return defaultImage;
        const sep = photo.includes('?') ? '&' : '?';
        return timestamp ? `${photo}${sep}t=${timestamp}` : photo;
    };

    const openPhotoModal = (index = 0) => {
        setCurrentPhotoIndex(index);
        setShowPhotoModal(true);
    };

    const closePhotoModal = () => {
        setShowPhotoModal(false);
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    };

    // Handle image error - fallback to default image
    const handleImageError = (e) => {
        if (!e.target.src.includes(defaultImage)) {
            e.target.src = defaultImage;
        }
    };

    if (error || !hotelData?.hotel) {
        return (
            <>
                <CountryHeroSection />
                <div className="container py-5 text-center">
                    <h3>{error || 'Hotel not found'}</h3>
                    <Link href="/" className="theme-button-orange rounded-1 mt-3 d-inline-block">
                        Back to Home
                    </Link>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <div className="container py-5">
                {/* Breadcrumb Skeleton */}
                <div className="d-flex align-items-center small mb-3">
                    <div className="skeleton-text" style={{ width: '50px', height: '16px' }}></div>
                    <span className="mx-2 text-muted">•</span>
                    <div className="skeleton-text" style={{ width: '80px', height: '16px' }}></div>
                    <span className="mx-2 text-muted">•</span>
                    <div className="skeleton-text" style={{ width: '120px', height: '16px' }}></div>
                </div>

                {/* Hotel Header Skeleton */}
                <div className="d-flex align-items-start flex-column flex-md-row mb-4">
                    <div className="me-auto">
                        <div className="d-flex align-items-center mb-2">
                            <div className="skeleton-title me-3" style={{ width: '250px', height: '40px' }}></div>
                            <div className="d-flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="skeleton-star" style={{ width: '18px', height: '18px', borderRadius: '4px' }}></div>
                                ))}
                            </div>
                        </div>
                        {/* Hotel Type Tag */}
                        <div className="skeleton-text mb-2" style={{ width: '100px', height: '24px', borderRadius: '20px' }}></div>
                        {/* Address */}
                        <div className="skeleton-text mb-1" style={{ width: '300px', height: '16px' }}></div>
                        {/* View Map and Nearby Hotels */}
                        <div className="d-flex gap-3 mb-2">
                            <div className="skeleton-text" style={{ width: '70px', height: '14px' }}></div>
                            <div className="skeleton-text" style={{ width: '90px', height: '14px' }}></div>
                        </div>
                    </div>
                    {/* Button */}
                    <div className="mt-3 mt-md-0">
                        <div className="skeleton-button" style={{ width: '160px', height: '40px', borderRadius: '4px' }}></div>
                    </div>
                </div>

                {/* Image Gallery Skeleton */}
                <div className="row g-2 mb-3">
                    <div className="col-md-8">
                        <div className="skeleton-image rounded-4" style={{ height: '400px', width: '100%' }}></div>
                    </div>
                    <div className="col-md-4">
                        <div className="row g-2 h-100">
                            <div className="col-6">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            <div className="col-6">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            <div className="col-6">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            <div className="col-6">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="border-bottom mb-4">
                    <div className="d-flex gap-3">
                        <div className="skeleton-text" style={{ width: '80px', height: '20px' }}></div>
                        <div className="skeleton-text" style={{ width: '70px', height: '20px' }}></div>
                        <div className="skeleton-text" style={{ width: '90px', height: '20px' }}></div>
                        <div className="skeleton-text" style={{ width: '100px', height: '20px' }}></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="skeleton-text mb-2" style={{ width: '100%', height: '16px' }}></div>
                        <div className="skeleton-text mb-2" style={{ width: '100%', height: '16px' }}></div>
                        <div className="skeleton-text mb-2" style={{ width: '90%', height: '16px' }}></div>
                        <div className="skeleton-text mb-2" style={{ width: '95%', height: '16px' }}></div>
                        <div className="skeleton-text mb-4" style={{ width: '80%', height: '16px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !hotelData?.hotel) {
        return (
            <>
                <CountryHeroSection />
                <div className="container py-5 text-center">
                    <h3>{error || 'Hotel not found'}</h3>
                    <Link href="/" className="theme-button-orange rounded-1 mt-3 d-inline-block">
                        Back to Home
                    </Link>
                </div>
            </>
        );
    }

    const hotelInfo = hotelData.hotel;
    const hotelPhotos = hotelData.hotelPhotos || [];
    const hotelFacilities = hotelData.hotelFacilities || [];
    const hotelReviews = hotelData.hotelReviews || [];

    // Get main photo
    const mainPhoto = hotelInfo.mainPhoto || defaultImage;

    // All photos for modal (only include photos that are not null/undefined)
    const allPhotos = [mainPhoto, ...hotelPhotos.map(p => p.photo)].filter(Boolean);

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/" className="text-dark text-decoration-none">Home</Link>
                        <span className="mx-2 text-muted">•</span>
                        <Link href={`/${hotelInfo.city?.toLowerCase()}`} className="text-dark text-decoration-none">{hotelInfo.city}</Link>
                        <span className="mx-2 text-muted">•</span>
                        <span className="fw-semibold text-decoration-none text-primary">{hotelInfo.hotelName}</span>
                    </div>
                </div>
            </div>

            {/* Hotel Header Info - Above Images */}
            <section className="container py-3">
                <div className="d-flex align-items-start flex-column flex-md-row mb-3">
                    <div className="me-auto">
                        <div className="d-flex align-items-center mb-2">
                            <h1 className="fw-bold mb-0 me-3" style={{ fontSize: '28px' }}>{hotelInfo.hotelName}</h1>
                            <div className="text-warning d-flex align-items-center me-3">
                                {[...Array(5)].map((_, i) => (
                                    <MdOutlineStarPurple500
                                        key={i}
                                        size={18}
                                        color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                    />
                                ))}
                            </div>
                            {/* Hotel Type Tag */}
                            <span
                                className="text-white px-3 py-1 mb-2 d-inline-block"
                                style={{
                                    background: '#ff7a00',
                                    borderRadius: '20px',
                                    fontSize: '12px'
                                }}
                            >
                                {hotelInfo.hotelType || 'Apartment Hotel'}
                            </span>
                        </div>



                        <div className="d-flex align-items-center mb-2">
                            {/* Address with Map Icon */}
                            <p className="mb-1 me-3">
                                {hotelInfo.address}
                            </p>

                            {/* View Map and Nearby Hotels */}
                            <FaMapMarkerAlt className="mb-1 me-1" />
                            <p className="mb-1 me-3">
                                View on map and nearby hotels
                            </p>
                        </div>
                    </div>

                    {/* Review Score Box */}
                    <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-start mt-3 mt-md-0 me-3">
                            <div
                                className="d-flex flex-column align-items-center justify-content-center p-2"
                                style={{ background: '#003580', borderRadius: '12px 12px 12px 0', minWidth: '70px' }}
                            >
                                <span className="text-white fw-bold fs-4">{hotelInfo.reviewScore}</span>
                            </div>
                            <div className="ms-2 d-flex flex-column justify-content-center">
                                <span className="fw-bold">{hotelInfo.reviewScore}</span>
                                <span className="text-muted small">{hotelInfo.reviewCount} verified reviews</span>
                            </div>
                        </div>

                        {/* See Rooms & Prices Button */}
                        <div className="mt-3 mt-md-0">
                            <Link
                                href={hotelInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="theme-button-blue rounded d-block text-center py-2 px-4"
                            >
                                See Rooms & Prices
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery with Carousel */}
            <section className="container py-3">
                <div className="row g-2">
                    {/* Main image with carousel */}
                    <div className="col-md-8">
                        <div
                            id="hotelCarousel"
                            className="carousel slide rounded-4 overflow-hidden"
                            data-bs-ride="carousel"
                            style={{ height: '400px' }}
                        >
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="0" className="active"></button>
                                {hotelPhotos.slice(0, 4).map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        data-bs-target="#hotelCarousel"
                                        data-bs-slide-to={idx + 1}
                                    ></button>
                                ))}
                            </div>
                            <div className="carousel-inner h-100">
                                <div className="carousel-item active h-100">
                                    <img
                                        src={getImageUrl(mainPhoto)}
                                        className="d-block w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        alt={hotelInfo.hotelName}
                                        onError={handleImageError}
                                    />
                                </div>
                                {hotelPhotos.slice(0, 4).map((photo, idx) => (
                                    <div key={idx} className="carousel-item h-100">
                                        <img
                                            src={getImageUrl(photo.photo)}
                                            className="d-block w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            alt={`${hotelInfo.hotelName} photo ${idx + 1}`}
                                            onError={handleImageError}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Carousel controls */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#hotelCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#hotelCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    {/* Side images grid */}
                    <div className="col-md-4">
                        <div className="row g-2 h-100">
                            {hotelPhotos.slice(0, 4).map((photo, idx) => (
                                <div key={idx} className="col-6">
                                    <div
                                        className="rounded-4 overflow-hidden position-relative photo-hover-container"
                                        style={{ height: '100%', minHeight: '190px', cursor: 'pointer' }}
                                        onClick={() => openPhotoModal(idx + 1)}
                                    >
                                        <img
                                            src={getImageUrl(photo.photo)}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            alt={`${hotelInfo.hotelName} photo ${idx + 1}`}
                                            onError={handleImageError}
                                        />
                                        <div className="photo-hover-overlay d-flex align-items-center justify-content-center">
                                            <span className="btn btn-light border rounded-pill px-3 py-1">
                                                <FaCamera className="me-1" /> View
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* View all photos button */}
                <div className="mt-2">
                    <button
                        className="btn btn-light border rounded-pill px-4 py-2 shadow-sm view-photos-btn"
                        onClick={() => openPhotoModal()}
                    >
                        <FaCamera className="me-2" />
                        View all {allPhotos.length} photos
                    </button>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="container py-4">
                {/* Tab Navigation */}
                <div className="border-bottom mb-4">
                    <ul className="nav nav-tabs custom-tabs border-bottom" role="tablist">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Traveller reviews
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'facilities' ? 'active' : ''}`}
                                onClick={() => setActiveTab('facilities')}
                            >
                                Facilities
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'policies' ? 'active' : ''}`}
                                onClick={() => setActiveTab('policies')}
                            >
                                Hotel Policies
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'askPrice' ? 'active' : ''}`}
                                onClick={() => setActiveTab('askPrice')}
                            >
                                Ask For Prices
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'writeReview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('writeReview')}
                            >
                                Write Review
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        {activeTab === 'overview' && (
                            <div className="tab-content">
                                {/* Description */}
                                <div className="mb-4">
                                    <p
                                        className="text-muted"
                                        style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}
                                    >
                                        {hotelInfo.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    {hotelReviews.length > 0 ? (
                                        <div className="row">
                                            {hotelReviews.map((review, idx) => (
                                                <div key={idx} className="col-12 mb-4">
                                                    <div className="border rounded-4 p-4 bg-white">

                                                        <div className="d-flex">

                                                            {/* Avatar */}
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    minWidth: '50px',
                                                                    background: '#e6eef6',
                                                                    color: '#5f7f9c',
                                                                    fontWeight: '600',
                                                                    fontSize: '18px',
                                                                    lineHeight: '1',
                                                                    flexShrink: 0
                                                                }}
                                                            >
                                                                {review.travellerName
                                                                    ? review.travellerName.charAt(0).toUpperCase()
                                                                    : 'S'}
                                                            </div>

                                                            {/* Reviewer Info */}
                                                            <div style={{ minWidth: "180px" }}>
                                                                <p className="mb-1 fw-bold">{review.travellerName || "Guest"}</p>
                                                                <p className="mb-0 text-muted small">
                                                                    {review?.reviewType}
                                                                </p>
                                                            </div>

                                                            {/* Review Content */}
                                                            <div className="flex-grow-1">

                                                                {/* Stars */}
                                                                {/* <div className="mb-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <MdOutlineStarPurple500
                                                                            key={i}
                                                                            size={18}
                                                                            color="#f0831e"
                                                                        />
                                                                    ))}
                                                                </div> */}

                                                                {/* Review Title */}
                                                                <h6 className="fw-bold mb-1">
                                                                    {review?.reviewTitle}
                                                                </h6>

                                                                {/* Review Text */}
                                                                <p className="text-muted mb-0">
                                                                    {review.positive || review.negative}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border rounded p-4 text-center">
                                            <p className="text-muted mb-0">No reviews available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'facilities' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    {hotelFacilities.length > 0 ? (
                                        <div className="row">
                                            {hotelFacilities.map((facilityGroup, idx) => (
                                                <div key={idx} className="col-12 mb-3">
                                                    <h6 className="fw-bold mb-2">{facilityGroup.facilityType}</h6>
                                                    <p className="text-muted mb-0">
                                                        {facilityGroup.facilities.split('|').map((f, i) => f.trim()).join(', ')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="col-12">
                                            <div className="border rounded p-4 text-center">
                                                <p className="text-muted mb-0">No facilities information available.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeTab === 'policies' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Hotel Policies</h5>
                                    <div className="border rounded p-4">
                                        <p className="mb-0 text-muted" >
                                            {hotelInfo.hotelPolicy || 'No special policies listed.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Check-in / Check-out</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="border rounded p-4">
                                                <p className="mb-2 fw-bold text-primary" style={{ fontSize: '18px' }}>Check-in</p>
                                                <p className="mb-0 text-muted">
                                                    From {hotelInfo.checkIn ? hotelInfo.checkIn.slice(0, 5) : '00:00'} to 23:59
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="border rounded p-4">
                                                <p className="mb-2 fw-bold text-primary" style={{ fontSize: '18px' }}>Check-out</p>
                                                <p className="mb-0 text-muted">
                                                    Until {hotelInfo.checkOut ? hotelInfo.checkOut.slice(0, 5) : '11:00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'askPrice' && (
                            <div className="tab-content">
                                <div className="row">
                                    {/* Left Column - Hotel Info Card */}
                                    <div className="col-lg-4 mb-4">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">{hotelInfo.hotelName}</h5>
                                            <div className="text-warning d-flex align-items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <MdOutlineStarPurple500
                                                        key={i}
                                                        size={16}
                                                        color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted small mb-2">
                                                <FaMapMarkerAlt className="text-primary me-1" />
                                                {hotelInfo.address}, {hotelInfo.city}
                                            </p>
                                            <hr />
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Score</span>
                                                <span className="fw-bold">{hotelInfo.reviewScore}/10</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Count</span>
                                                <span className="fw-bold">{hotelInfo.reviewCount} reviews</span>
                                            </div>
                                            <hr />
                                            <p className="text-muted small mb-0">
                                                <i className="fa-solid fa-tag me-2"></i>
                                                Best price guarantee
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - Contact Form */}
                                    <div className="col-lg-8">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">Ask for Prices</h5>
                                            <p className="text-muted mb-4">
                                                Looking for the best deal? Send us your requirements and we will get back to you with the best available prices.
                                            </p>
                                            <form onSubmit={(e) => { e.preventDefault(); alert('Price request sent!'); }}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your Name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Your Email"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea
                                                            className="form-control"
                                                            rows="4"
                                                            placeholder="Your requirements (number of rooms, guests, special requests, etc.)"
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn btn-primary px-5 py-2">
                                                            Send Request
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'writeReview' && (
                            <div className="tab-content">
                                <div className="row">
                                    {/* Left Column - Hotel Info Card */}
                                    <div className="col-lg-4 mb-4">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">{hotelInfo.hotelName}</h5>
                                            <div className="text-warning d-flex align-items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <MdOutlineStarPurple500
                                                        key={i}
                                                        size={16}
                                                        color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted small mb-2">
                                                <FaMapMarkerAlt className="text-primary me-1" />
                                                {hotelInfo.address}, {hotelInfo.city}
                                            </p>
                                            <hr />
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Score</span>
                                                <span className="fw-bold">{hotelInfo.reviewScore}/10</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Count</span>
                                                <span className="fw-bold">{hotelInfo.reviewCount} reviews</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Review Form */}
                                    <div className="col-lg-8">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">Write a Review</h5>
                                            <p className="text-muted mb-4">
                                                Your review helps other travelers make informed decisions about their stay.
                                            </p>
                                            <form onSubmit={(e) => { e.preventDefault(); alert('Review submitted!'); }}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your Name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <select className="form-select" required>
                                                            <option value="">Select Travel Type</option>
                                                            <option value="solo">Solo traveler</option>
                                                            <option value="couple">Couple</option>
                                                            <option value="family">Family</option>
                                                            <option value="business">Business</option>
                                                            <option value="friends">Friends</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fw-bold">Your Rating</label>
                                                            <div className="d-flex align-items-center">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <MdOutlineStarPurple500
                                                                        key={star}
                                                                        className="text-warning"
                                                                        style={{ fontSize: '32px', cursor: 'pointer' }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="What did you like most?"
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="What could be improved?"
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn btn-primary px-5 py-2">
                                                            Submit Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Photo Modal */}
            {showPhotoModal && (
                <div className="photo-modal-overlay" onClick={closePhotoModal}>
                    <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="photo-modal-header">
                            <h3 className="photo-modal-title">{hotelInfo.hotelName}</h3>
                            <span className="photo-modal-counter">{currentPhotoIndex + 1} of {allPhotos.length}</span>
                            <button className="photo-modal-close" onClick={closePhotoModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="photo-modal-body">
                            <button className="photo-modal-nav photo-modal-prev" onClick={prevPhoto}>
                                <FaChevronLeft />
                            </button>
                            <img
                                src={allPhotos[currentPhotoIndex]}
                                alt={`Photo ${currentPhotoIndex + 1}`}
                                className="photo-modal-image"
                                onError={handleImageError}
                            />
                            <button className="photo-modal-nav photo-modal-next" onClick={nextPhoto}>
                                <FaChevronRight />
                            </button>
                        </div>
                        <div className="photo-modal-footer">
                            {allPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={photo}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`photo-thumbnail ${currentPhotoIndex === idx ? 'active' : ''}`}
                                    onClick={() => setCurrentPhotoIndex(idx)}
                                    onError={handleImageError}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
