'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaCamera, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SiAmericanexpress, SiVisa, SiMastercard, SiDinersclub, SiJcb, SiWesternunion } from 'react-icons/si';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { saveCustomerReview } from '@/lib/api/public/hotelapi';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

export default function HotelDetails({ initialData }) {
    const hotelData = initialData;
    const loading = !initialData;
    const hotelInfo = hotelData?.hotel;
    const hotelPhotos = hotelData?.hotelPhotos || [];
    const [error, setError] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [timestamp, setTimestamp] = useState('');
    const [overallReviewRating, setOverallReviewRating] = useState(0);
    const [categoryRatings, setCategoryRatings] = useState({
        service: 0,
        rooms: 0,
        location: 0
    });

    // Review form state
    const [reviewForm, setReviewForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        reviewTitle: '',
        reviewText: '',
        tripType: 'select'
    });
    const [reviewErrors, setReviewErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Yup validation schema for review form
    const reviewSchema = yup.object().shape({
        firstName: yup
            .string()
            .required('First name is required')
            .test('min-length', 'First name must be at least 2 characters', function (value) {
                if (!value) return true; // Let required handle empty case
                return value.length >= 2;
            })
            .test('max-length', 'First name must not exceed 50 characters', function (value) {
                if (!value) return true;
                return value.length <= 50;
            }),
        lastName: yup
            .string()
            .required('Last name is required')
            .test('min-length', 'Last name must be at least 2 characters', function (value) {
                if (!value) return true;
                return value.length >= 2;
            })
            .test('max-length', 'Last name must not exceed 50 characters', function (value) {
                if (!value) return true;
                return value.length <= 50;
            }),
        email: yup
            .string()
            .required('Email is required')
            .test('valid-email', 'Please enter a valid email address', function (value) {
                if (!value) return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }),
        reviewTitle: yup
            .string()
            .required('Review title is required')
            .test('max-length', 'Review title must not exceed 100 characters', function (value) {
                if (!value) return true;
                return value.length <= 100;
            }),
        reviewText: yup
            .string()
            .required('Review text is required')
            .test('max-length', 'Review must not exceed 1000 characters', function (value) {
                if (!value) return true;
                return value.length <= 1000;
            }),
        tripType: yup
            .string()
            .required('Please select a trip type')
            .test('not-select', 'Please select a trip type', function (value) {
                return value !== 'select';
            })
    });

    const handleReviewFieldChange = async (field, value) => {
        const nextForm = { ...reviewForm, [field]: value };
        setReviewForm(nextForm);

        if (!reviewErrors[field]) {
            return;
        }

        try {
            await reviewSchema.validateAt(field, nextForm);
            setReviewErrors((prev) => {
                const { [field]: removed, ...rest } = prev;
                return rest;
            });
        } catch (validationError) {
            setReviewErrors((prev) => ({
                ...prev,
                [field]: validationError.message
            }));
        }
    };

    const formatLastUpdated = (value) => {
        if (!value) return 'Unknown';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    };

    const handlePolicyReload = () => {
        if (typeof window !== 'undefined') {
            window.location.href = window.location.href;
        }
    };

    const createReviewPayload = () => {
        const hotelId = hotelInfo?.hotelId ?? hotelInfo?.id ?? null;
        const hotelAddress = hotelInfo?.address || hotelInfo?.hotelAddress || '';
        const thumbUrl = hotelInfo?.mainPhoto || hotelInfo?.thumbnail || hotelInfo?.thumbUrl || defaultImage;
        const hotelName = hotelInfo?.hotelName || hotelInfo?.name || '';
        const city = hotelInfo?.city || '';
        const country = hotelInfo?.country || '';

        return {
            hotelId,
            email: reviewForm.email,
            firstName: reviewForm.firstName,
            lastName: reviewForm.lastName,
            isActive: 1,
            hotelAddress,
            starRating: overallReviewRating ? overallReviewRating.toString() : '0',
            thumbUrl,
            hotelName,
            city,
            country
        };
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            await reviewSchema.validate(reviewForm, { abortEarly: false });

            const payload = {
                ...createReviewPayload(),
                service: categoryRatings.service,
                rooms: categoryRatings.rooms,
                location: categoryRatings.location,
                reviewTitle: reviewForm.reviewTitle,
                reviewDescription: reviewForm.reviewText,
                trip: reviewForm.tripType
            };

            setIsSubmitting(true);

            const data = await saveCustomerReview(payload);
            toast.success(data.message || 'Review submitted successfully');
            setReviewErrors({});
            setReviewForm({
                firstName: '',
                lastName: '',
                email: '',
                reviewTitle: '',
                reviewText: '',
                tripType: 'select'
            });
            setOverallReviewRating(0);
            setCategoryRatings({ service: 0, rooms: 0, location: 0 });
        } catch (err) {
            if (err.inner) {
                const errors = {};
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
                setReviewErrors(errors);
            } else {
                toast.error(err.message || 'Unable to submit review');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Default image path
    const defaultImage = '/image/property-img.webp';
    const modalPhotos = [hotelInfo?.mainPhoto || defaultImage, ...hotelPhotos.map((p) => p.photo)].filter(Boolean);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimestamp(Date.now().toString());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!showPhotoModal || modalPhotos.length <= 1) return undefined;

        const autoSlide = setInterval(() => {
            setCurrentPhotoIndex((prev) => (prev + 1) % modalPhotos.length);
        }, 3000);

        return () => clearInterval(autoSlide);
    }, [showPhotoModal, modalPhotos.length]);

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

    const renderReviewStars = (rating, onRate, keyPrefix) => (
        <div className="write-review-stars" role="radiogroup" aria-label={`${keyPrefix} rating`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={`${keyPrefix}-${value}`}
                    type="button"
                    className="write-review-star-button"
                    onClick={() => onRate(value)}
                    aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                    aria-pressed={rating === value}
                >
                    <MdOutlineStarPurple500 size={28} color={value <= rating ? '#f0831e' : '#d8dde7'} />
                </button>
            ))}
        </div>
    );

    if (error || !hotelInfo) {
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
                                    <div
                                        key={i}
                                        className="skeleton-star"
                                        style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                                    ></div>
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
                    <div className="col-12 col-lg-8">
                        {' '}
                        <div className="skeleton-image rounded-4" style={{ width: '100%' }}></div>
                    </div>
                    <div className="col-md-4">
                        <div className="row g-2 h-100">
                            {/* <div className="col-6"> */}
                            <div className="col-12">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            {/* <div className="col-6"> */}
                            <div className="col-12">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            {/* <div className="col-6"> */}
                            <div className="col-12">
                                <div className="skeleton-image rounded-4" style={{ height: '190px', width: '100%' }}></div>
                            </div>
                            {/* <div className="col-6"> */}
                            <div className="col-12">
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

    if (error || !hotelInfo) {
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

    const hotelFacilities = hotelData.hotelFacilities || [];
    const hotelReviews = hotelData.hotelReviews || [];

    // Get main photo
    const mainPhoto = hotelInfo.mainPhoto || defaultImage;

    // All photos for modal (only include photos that are not null/undefined)
    const allPhotos = [mainPhoto, ...hotelPhotos.map((p) => p.photo)].filter(Boolean);
    function toSlug(value = '') {
        return value.toLowerCase().replace(/\s+/g, '-');
    }
    const openMap = (lat, lng) => {
        if (!lat || !lng) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    };

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}

            <div className="py-3">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/destinations" className="text-dark text-decoration-none">
                                    All Countries
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px">
                                <Link href={`/${hotelInfo.countryUrl?.toLowerCase()}`} className="text-dark text-decoration-none">
                                    {hotelInfo.country}
                                </Link>
                            </li>

                            {hotelInfo.region && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <Link href={`${hotelInfo.regionUrl?.toLowerCase()}`} className="text-dark text-decoration-none">
                                        {hotelInfo.region}
                                    </Link>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px">
                                <Link href={`${hotelInfo.cityUrl?.toLowerCase()}`} className="text-dark text-decoration-none">
                                    {hotelInfo.city}
                                </Link>
                            </li>

                            {/* ✅ Clickable active */}
                            <li className="breadcrumb-item small-para-14-px active">
                                <Link
                                    href={`${hotelInfo.cityUrl?.toLowerCase()}/${toSlug(hotelInfo.hotelName)}`}
                                    className="text-decoration-none"
                                >
                                    {hotelInfo.hotelName}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hotel Header Info - Above Images */}
            <section className="container py-3">
                <div className="d-flex align-items-start flex-column flex-md-row mb-3 hotel-detail-header">
                    {' '}
                    <div className="me-auto">
                        <div className="d-flex align-items-center mb-2">
                            <h4 className="fw-600 mb-0 me-3 fs-5 fw-bold hotel-detail-title"> {hotelInfo.hotelName}</h4>
                            <div className="text-warning d-flex align-items-center me-3">
                                {[...Array(5)].map((_, i) => (
                                    <MdOutlineStarPurple500 key={i} size={18} color={i < hotelInfo.stars ? '#f0831e' : '#ddd'} />
                                ))}
                            </div>
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
                        <div className="hotel-detail-location mb-2">
                            <p
                                className="hotel-address-text mb-1"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openMap(hotelInfo.latitude, hotelInfo.longitude);
                                }}
                            >
                                {hotelInfo.address}
                            </p>

                            <div className="d-flex align-items-center gap-1 hotel-detail-map">
                                <FaMapMarkerAlt />
                                <p className="hotel-map-link mb-0">View on map and nearby hotels</p>
                            </div>
                        </div>
                    </div>
                    <div className="hotel-detail-review mb-2">
                        {' '}
                        <div className="d-flex align-items-start mt-3 mt-md-0 me-3">
                            <div
                                className="d-flex flex-column align-items-center justify-content-center p-2"
                                style={{
                                    background: '#003580',
                                    borderRadius: '10px 10px 10px 0px',
                                    width: '40px',
                                    height: '40px',
                                    fontSize: '12px'
                                }}
                            >
                                <span className="text-white  fs-9">{hotelInfo.reviewScore}</span>
                            </div>
                            <div className="ms-2 d-flex flex-column justify-content-center">
                                <span className="fw-bold">{hotelInfo.ratingText}</span>
                                <span className="text-muted small">{hotelInfo.reviewCount} verified reviews</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-md-flex align-items-center ms-auto hotel-detail-price-btn-desktop ">
                        <Link
                            href={hotelInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-button-blue d-flex align-items-center justify-content-center px-3"
                            style={{ height: '48px', borderRadius: '6px' }}
                        >
                            See Rooms & Prices
                        </Link>
                    </div>
                </div>
            </section>

            {/* Image Gallery with Carousel */}
            <section className="container py-3">
                <div className="row g-2">
                    {/* Main image with carousel */}
                    <div className="col-12 col-lg-8">
                        {' '}
                        <div
                            id="hotelCarousel"
                            className="carousel slide rounded-4 overflow-hidden position-relative"
                            data-bs-ride="carousel"
                            style={{ height: '400px' }}
                        >
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="0" className="active"></button>
                                {hotelPhotos.slice(0, 4).map((_, idx) => (
                                    <button key={idx} type="button" data-bs-target="#hotelCarousel" data-bs-slide-to={idx + 1}></button>
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
                    <div className="col-lg-4 d-none d-lg-block hotel-detail-side-images">
                        {' '}
                        <div className="row g-2 h-100">
                            {hotelPhotos.slice(0, 2).map((photo, idx) => (
                                <div key={idx} className="col-12 mb-2">
                                    <div
                                        className="rounded-4 overflow-hidden position-relative photo-hover-container"
                                        style={{ height: '190px', cursor: 'pointer' }}
                                        onClick={() => openPhotoModal(idx + 1)}
                                    >
                                        <img
                                            src={getImageUrl(photo.photo)}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            alt="hotel"
                                        />

                                        {/* ✅ ONLY ON LAST IMAGE */}
                                        {idx === 1 && (
                                            <div className="side-view-photos-btn">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPhotoModal();
                                                    }}
                                                >
                                                    View all photos ({allPhotos.length})
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-3 d-block d-md-none hotel-detail-price-btn">
                    {' '}
                    <Link
                        href={hotelInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="theme-button-blue rounded d-flex align-items-center justify-content-center py-2 px-4"
                    >
                        See Rooms & Prices
                    </Link>
                </div>

                {/* View all photos button */}
                {/* <div className="mt-2 d-none d-lg-block">
                    {' '}
                    <button
                        className="btn btn-light border rounded-pill px-4 py-2 shadow-sm view-photos-btn"
                        onClick={() => openPhotoModal()}
                    >
                        <FaCamera className="me-2" />
                        View all {allPhotos.length} photos
                    </button>
                </div> */}
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
                                        className="text-muted hotel-detail-description"
                                        style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}
                                    >
                                        {' '}
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
                                                                {review.travellerName ? review.travellerName.charAt(0).toUpperCase() : 'S'}
                                                            </div>

                                                            {/* Reviewer Info */}
                                                            <div style={{ minWidth: '180px' }}>
                                                                <p className="mb-1 fw-bold">{review.travellerName || 'Guest'}</p>
                                                                <p className="mb-0 text-muted small">{review?.reviewType}</p>
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
                                                                <h6 className="fw-bold mb-1">{review?.reviewTitle}</h6>

                                                                {/* Review Text */}
                                                                <p className="text-muted mb-0">{review.positive || review.negative}</p>
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
                                                        {facilityGroup.facilities
                                                            .split('|')
                                                            .map((f, i) => f.trim())
                                                            .join(', ')}
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
                                    <div className="row g-2">
                                        <div className="row mb-4">
                                            <span className="fw-bold" style={{ fontSize: '18px' }}>
                                                Check-in
                                            </span>
                                            <span className="text-muted">
                                                From {hotelInfo.checkIn ? hotelInfo.checkIn.slice(0, 5) : '00:00'} to 23:59
                                            </span>
                                        </div>
                                        <div className="row mb-4">
                                            <span className="fw-bold" style={{ fontSize: '18px' }}>
                                                Check-out
                                            </span>
                                            <span className="text-muted">
                                                Until {hotelInfo.checkOut ? hotelInfo.checkOut.slice(0, 5) : '11:00'}
                                            </span>
                                        </div>
                                        <div className="row mb-4">
                                            <span className="fw-bold" style={{ fontSize: '18px' }}>
                                                Cancellation & prepayment
                                            </span>
                                            <span className="text-muted">
                                                {hotelInfo.cancellationPolicy ||
                                                    'Cancellation and prepayment policies vary by room type. Please check your booking details before finalizing.'}
                                            </span>
                                        </div>
                                        <div className="row mb-4">
                                            <span className="fw-bold" style={{ fontSize: '18px' }}>
                                                Accepted credit cards
                                            </span>
                                            <span className="text-muted">
                                                {hotelInfo.acceptedCreditCards ||
                                                    'The hotel reserves the right to pre-authorise credit cards prior to arrival.'}
                                            </span>
                                            {/* <div className="d-flex align-items-center flex-wrap gap-3 mt-3">
                                                <SiAmericanexpress size={36} color="#2e77bc" />
                                                <SiVisa size={36} color="#142688" />
                                                <SiMastercard size={36} color="#eb001b" />
                                                <SiDinersclub size={36} color="#006ba6" />
                                                <SiJcb size={36} color="#0058a3" />
                                                <SiWesternunion size={36} color="#ffd300" />
                                            </div> */}
                                        </div>
                                        <div className="row mb-4">
                                            <span className="fw-bold" style={{ fontSize: '18px' }}>
                                                The fine print
                                            </span>
                                            <span className="text-muted">{hotelInfo.hotelPolicy || 'No special policies listed.'}</span>
                                        </div>
                                        <div className="d-flex justify-content-start align-items-center mb-2 gap-4">
                                            <span className="text-muted small">
                                                Last updated: {formatLastUpdated(hotelInfo.lastUpdated)}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-none"
                                                style={{ color: '#0077c0' }}
                                                onMouseOver={(e) => (e.currentTarget.style.color = '#d97706')}
                                                onMouseOut={(e) => (e.currentTarget.style.color = '#0077c0')}
                                                onClick={handlePolicyReload}
                                            >
                                                Reload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'askPrice' && (
                            <div className="tab-content">
                                <h5 className="fw-bold mb-3">Setup a Price watch for {hotelInfo.hotelName}</h5>
                                <p className="text-muted mb-2">
                                    Each day we&apos;ll check prices and send you an email for your selected dates at {hotelInfo.hotelName}.
                                </p>
                                <p className="text-muted mb-4">
                                    If you don&apos;t have specific dates but would like to check prices for say next weekend or say next
                                    month we can check the price too.
                                </p>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        alert('Price watch setup!');
                                    }}
                                >
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <span className="mb-2">Enter your name</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ backgroundColor: '#f3f4f7', borderRadius: '16px', border: 'none' }}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <span className="mb-2">Enter your email</span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                style={{ backgroundColor: '#f3f4f7', borderRadius: '16px', border: 'none' }}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <button type="submit" className="theme-button-orange rounded px-5 py-2">
                                                Send Me Details
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div className="mt-4">
                                    <a
                                        href="#"
                                        className="small me-2"
                                        style={{ color: '#f0831e' }}
                                        onMouseOver={(e) => (e.target.style.color = '#0077c0')}
                                        onMouseOut={(e) => (e.target.style.color = '#f0831e')}
                                    >
                                        Privacy
                                    </a>
                                    <span className="text-muted small">/</span>
                                    <a
                                        href="#"
                                        className="small ms-2"
                                        style={{ color: '#f0831e' }}
                                        onMouseOver={(e) => (e.target.style.color = '#0077c0')}
                                        onMouseOut={(e) => (e.target.style.color = '#f0831e')}
                                    >
                                        Terms
                                    </a>
                                </div>
                            </div>
                        )}

                        {activeTab === 'writeReview' && (
                            <div className="tab-content">
                                <div className="write-review-layout">
                                    <div className="write-review-form-column">
                                        <h5 className="fw-bold mb-4">Share your experience with other travellers.</h5>
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="write-review-field-row">
                                                <label className="write-review-label">Select Rating</label>
                                                {renderReviewStars(overallReviewRating, setOverallReviewRating, 'overall')}
                                            </div>
                                            <div className="write-review-field-row">
                                                <label htmlFor="reviewFirstName" className="write-review-label">
                                                    First Name
                                                </label>
                                                <div className="write-review-field-input">
                                                    <input
                                                        id="reviewFirstName"
                                                        type="text"
                                                        className={`form-control write-review-input ${reviewErrors.firstName ? 'is-invalid' : ''}`}
                                                        value={reviewForm.firstName}
                                                        onChange={(e) => handleReviewFieldChange('firstName', e.target.value)}
                                                    />
                                                    {reviewErrors.firstName && (
                                                        <div className="invalid-feedback">{reviewErrors.firstName}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="write-review-field-row">
                                                <label htmlFor="reviewLastName" className="write-review-label">
                                                    Last Name
                                                </label>
                                                <div className="write-review-field-input">
                                                    <input
                                                        id="reviewLastName"
                                                        type="text"
                                                        className={`form-control write-review-input ${reviewErrors.lastName ? 'is-invalid' : ''}`}
                                                        value={reviewForm.lastName}
                                                        onChange={(e) => handleReviewFieldChange('lastName', e.target.value)}
                                                    />
                                                    {reviewErrors.lastName && (
                                                        <div className="invalid-feedback">{reviewErrors.lastName}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="write-review-field-row">
                                                <label htmlFor="reviewEmail" className="write-review-label">
                                                    Email
                                                </label>
                                                <div className="write-review-field-input">
                                                    <input
                                                        id="reviewEmail"
                                                        type="email"
                                                        className={`form-control write-review-input ${reviewErrors.email ? 'is-invalid' : ''}`}
                                                        value={reviewForm.email}
                                                        onChange={(e) => handleReviewFieldChange('email', e.target.value)}
                                                    />
                                                    {reviewErrors.email && <div className="invalid-feedback">{reviewErrors.email}</div>}
                                                </div>
                                            </div>
                                            <div className="write-review-field-row">
                                                <label htmlFor="reviewTitle" className="write-review-label">
                                                    Title of your review
                                                </label>
                                                <div className="write-review-field-input">
                                                    <input
                                                        id="reviewTitle"
                                                        type="text"
                                                        className={`form-control write-review-input ${reviewErrors.reviewTitle ? 'is-invalid' : ''}`}
                                                        value={reviewForm.reviewTitle}
                                                        onChange={(e) => handleReviewFieldChange('reviewTitle', e.target.value)}
                                                    />
                                                    {reviewErrors.reviewTitle && (
                                                        <div className="invalid-feedback">{reviewErrors.reviewTitle}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="write-review-field-row write-review-field-row-textarea">
                                                <label htmlFor="reviewText" className="write-review-label">
                                                    Your review
                                                </label>
                                                <div className="write-review-field-input">
                                                    <textarea
                                                        id="reviewText"
                                                        className={`form-control write-review-input write-review-textarea ${reviewErrors.reviewText ? 'is-invalid' : ''}`}
                                                        rows="5"
                                                        value={reviewForm.reviewText}
                                                        onChange={(e) => handleReviewFieldChange('reviewText', e.target.value)}
                                                    ></textarea>
                                                    {reviewErrors.reviewText && (
                                                        <div className="invalid-feedback">{reviewErrors.reviewText}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="write-review-field-row">
                                                <label htmlFor="reviewTripType" className="write-review-label">
                                                    What sort of trip was this?
                                                </label>
                                                <div className="write-review-field-input">
                                                    <select
                                                        id="reviewTripType"
                                                        className={`form-select write-review-input write-review-select ${reviewErrors.tripType ? 'is-invalid' : ''}`}
                                                        value={reviewForm.tripType}
                                                        onChange={(e) => handleReviewFieldChange('tripType', e.target.value)}
                                                    >
                                                        <option value="select">Select</option>
                                                        <option value="solo">Solo Traveller</option>
                                                        <option value="couple">Couple</option>
                                                        <option value="family">Family</option>
                                                        <option value="business">Business</option>
                                                        <option value="friends">Friends</option>
                                                    </select>
                                                    {reviewErrors.tripType && (
                                                        <div className="invalid-feedback">{reviewErrors.tripType}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="write-review-submit-wrap">
                                                <button
                                                    type="submit"
                                                    className="theme-button-orange write-review-submit"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="write-review-ratings-column">
                                        <h5 className="fw-bold mb-4">Hotel Ratings (Click to select a rating)</h5>
                                        <div className="write-review-rating-list">
                                            <div className="write-review-rating-item">
                                                <span className="write-review-rating-label">Service</span>
                                                {renderReviewStars(
                                                    categoryRatings.service,
                                                    (value) => setCategoryRatings((prev) => ({ ...prev, service: value })),
                                                    'service'
                                                )}
                                            </div>
                                            <div className="write-review-rating-item">
                                                <span className="write-review-rating-label">Rooms</span>
                                                {renderReviewStars(
                                                    categoryRatings.rooms,
                                                    (value) => setCategoryRatings((prev) => ({ ...prev, rooms: value })),
                                                    'rooms'
                                                )}
                                            </div>
                                            <div className="write-review-rating-item">
                                                <span className="write-review-rating-label">Location</span>
                                                {renderReviewStars(
                                                    categoryRatings.location,
                                                    (value) => setCategoryRatings((prev) => ({ ...prev, location: value })),
                                                    'location'
                                                )}
                                            </div>
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
                     
                        <div className="photo-modal-body">
                            <div className="photo-modal-image-stage">
                                <img
                                    src={getImageUrl(allPhotos[currentPhotoIndex])}
                                    alt={`Photo ${currentPhotoIndex + 1}`}
                                    className="photo-modal-image"
                                    onError={handleImageError}
                                />
                                <button className="photo-modal-nav photo-modal-prev" onClick={prevPhoto}>
                                    <FaChevronLeft />
                                </button>
                                <button className="photo-modal-nav photo-modal-next" onClick={nextPhoto}>
                                    <FaChevronRight />
                                </button>
                                <div className="photo-modal-indicators" aria-hidden="true">
                                    {allPhotos.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`photo-modal-indicator ${currentPhotoIndex === idx ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="photo-modal-footer">
                            <div className="photo-thumbnail-strip">
                                {allPhotos.map((photo, idx) => (
                                    <img
                                        key={idx}
                                        src={getImageUrl(photo)}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className={`photo-thumbnail ${currentPhotoIndex === idx ? 'active' : ''}`}
                                        onClick={() => setCurrentPhotoIndex(idx)}
                                        onError={handleImageError}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
