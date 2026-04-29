'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { addMonths, format } from 'date-fns';
import { globalSearchapi } from '@/lib/api/public/globalsearchapi';
import { useRouter } from 'next/navigation';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import Image from 'next/image';
import SearchSummaryBar from '@/components/mobile-search/SearchSummaryBar';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });

export default function HeroSection({ variant = 'home' }) {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mobileCalendarPickerMode, setMobileCalendarPickerMode] = useState(null);
    const [tempCheckInDate, setTempCheckInDate] = useState(null);
    const [tempCheckOutDate, setTempCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);
    const [tempGuests, setTempGuests] = useState(2);
    const [tempRooms, setTempRooms] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [childrenAges, setChildrenAges] = useState([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
    const [showMobileRoomsPanel, setShowMobileRoomsPanel] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const datePickerRef = useRef(null);
    const ignoreDatePickerCloseRef = useRef(false);
    const debounceRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const now = new Date();
        setCheckInDate(now);
        setCheckOutDate(now);
        setTempCheckInDate(now);
        setTempCheckOutDate(now);
    }, []);

    useEffect(() => {
        function handleResize() {
            setIsMobileView(window.innerWidth <= 768);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // Handle click outside to close
    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (
    //             datePickerRef.current &&
    //             !datePickerRef.current.contains(event.target) &&
    //             !event.target.closest('.react-datepicker') &&
    //             !event.target.closest('.date-range-picker-popup')
    //         ) {
    //             setShowDatePicker(false);
    //         }
    //     }
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);
    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        if (query.length < 2) {
            setResults([]);
            setShow(false);
            return;
        }

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const data = await globalSearchapi(query);
                setResults(data || []);
                setShow(true);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({
        min: 100,
        max: 600
    });
    const searchRef = useRef(null);
    const roomsDropdownRef = useRef(null);
    const filterButtonRef = useRef(null);

    const MIN_PRICE = 0;
    const MAX_PRICE = 1000;

    const valueToPercent = (value) => ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    const [isSliding, setIsSliding] = useState(null);

    const filterRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const isSelectingRef = useRef(false);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setMobileCalendarPickerMode(null);
        setTempCheckInDate(start);
        setTempCheckOutDate(end);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return format(date, 'MM/dd/yyyy');
    };

    const handleOpenDatePicker = () => {
        const now = new Date();
        setMobileCalendarPickerMode(null);
        setShowMobileRoomsPanel(false);
        setTempCheckInDate(checkInDate || now);
        setTempCheckOutDate(checkOutDate || now);
        setShowDatePicker(true);
    };

    const handleToggleMobileDatePicker = () => {
        if (showDatePicker) {
            setMobileCalendarPickerMode(null);
            setShowDatePicker(false);
            return;
        }
        handleOpenDatePicker();
    };

    const handleToggleMobileRoomsPanel = () => {
        setShowMobileRoomsPanel((prev) => {
            const next = !prev;
            if (next) {
                setMobileCalendarPickerMode(null);
                setShowDatePicker(false);
            }
            return next;
        });
    };

    const updateChildrenCount = (nextCount) => {
        const count = Math.max(0, Math.min(10, nextCount));
        setChildrenCount(count);
        setChildrenAges((prev) => {
            if (count === 0) return [];
            if (prev.length === count) return prev;
            if (prev.length < count) {
                return prev.concat(Array(count - prev.length).fill(7));
            }
            return prev.slice(0, count);
        });
    };

    const handleChildrenChange = (e) => {
        updateChildrenCount(Number(e.target.value));
    };

    const updateTempRooms = (nextCount) => {
        const count = Math.max(1, Math.min(10, nextCount));
        setTempRooms(count);
    };

    const updateTempGuests = (nextCount) => {
        const count = Math.max(1, Math.min(10, nextCount));
        setTempGuests(count);
    };

    const handleAgeChange = (index, value) => {
        const updatedAges = [...childrenAges];
        updatedAges[index] = Number(value);
        setChildrenAges(updatedAges);
    };

    const getRoomsGuestsLabel = () => {
        const guestText = guests === 1 ? 'Guest' : 'Guests';
        const roomText = rooms === 1 ? 'Room' : 'Rooms';
        return `${guests} ${guestText}, ${rooms} ${roomText}`;
    };

    const handleSelect = (item) => {
        isSelectingRef.current = true;
        setSelectedLocation(item);
        setQuery(item.displayText);
        setShow(false);
    };
    const handleSearchSubmit = (e, overrides = {}) => {
        e.preventDefault();
        const nextGuests = overrides.guests ?? guests;
        const nextRooms = overrides.rooms ?? rooms;

        const params = new URLSearchParams({
            destination: selectedLocation?.displayText || query,
            destinationType: selectedLocation?.type || '',
            destinationId: selectedLocation?.id || '',
            checkIn: checkInDate.toISOString(),
            checkOut: checkOutDate.toISOString(),
            guests: nextGuests.toString(),
            rooms: nextRooms.toString(),
            children: childrenCount.toString(),
            childrenAges: childrenAges.join(',')
        });

        router.push(`/search?${params.toString()}`);
    };

    const handleSliderMouseDown = (type) => {
        setIsSliding(type);
    };

    const handleSliderMouseUp = () => {
        setIsSliding(null);
        setPriceRange({ ...priceRange });
    };
    useEffect(() => {
        function handleSearchOutsideClick(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShow(false); // close search dropdown
            }
        }

        document.addEventListener('mousedown', handleSearchOutsideClick);
        return () => document.removeEventListener('mousedown', handleSearchOutsideClick);
    }, []);

    useEffect(() => {
        function handleDatePickerOutsideClick(event) {
            if (!showDatePicker || ignoreDatePickerCloseRef.current) return;
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target) &&
                !event.target.closest('.mobile-date-picker-field') &&
                !event.target.closest('.react-datepicker') &&
                !event.target.closest('.date-range-picker-popup')
            ) {
                setShowDatePicker(false);
            }
        }

        document.addEventListener('mousedown', handleDatePickerOutsideClick);
        return () => document.removeEventListener('mousedown', handleDatePickerOutsideClick);
    }, [showDatePicker]);

    useEffect(() => {
        function handleFilterOutsideClick(event) {
            const clickedInsideFilterPanel = filterRef.current?.contains(event.target);
            const clickedFilterButton = filterButtonRef.current?.contains(event.target);

            if (!clickedInsideFilterPanel && !clickedFilterButton) {
                setShowFilters(false);
            }
        }

        document.addEventListener('mousedown', handleFilterOutsideClick);
        return () => document.removeEventListener('mousedown', handleFilterOutsideClick);
    }, []);

    useEffect(() => {
        function handleRoomsDropdownOutsideClick(event) {
            if (roomsDropdownRef.current && !roomsDropdownRef.current.contains(event.target)) {
                setShowRoomsDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleRoomsDropdownOutsideClick);
        return () => document.removeEventListener('mousedown', handleRoomsDropdownOutsideClick);
    }, []);

    useEffect(() => {
        document.body.style.userSelect = isSliding ? 'none' : 'auto';
    }, [isSliding]);

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

    const isCountryVariant = variant === 'common';
    const sectionClassName = isCountryVariant ? 'container-fluid p-0' : 'container-fluid';

    const heroClassName = isCountryVariant
        ? 'country-hero d-flex flex-column justify-content-between'
        : 'hero py-5 px-2 px-md-4 px-lg-5 d-flex flex-column justify-content-between';
    const heroShellClassName = isCountryVariant
        ? 'container p-2 hero-search-shell country-hero-search-shell d-none d-md-block'
        : 'container p-4 hero-form hero-search-shell main-hero-search-shell d-none d-md-block';
    const heroSearchRowClassName = isCountryVariant
        ? 'row hero-search-row main-hero-search-row'
        : 'row hero-search-row main-hero-search-row';
    // const heroSearchRowClassName = isCountryVariant
    //     ? 'row align-items-end hero-search-row country-hero-search-row'
    //     : 'row hero-search-row main-hero-search-row';
    const heroStyle = isCountryVariant
        ? {
              backgroundColor: '#0071b9',
              padding: '20px 0'
          }
        : undefined;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <section className={sectionClassName}>
            <div className={heroClassName} style={heroStyle}>
                {!isCountryVariant && (
                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 d-flex justify-content-center justify-content-md-start mb-4 mb-md-0">
                            <div className="my-auto d-flex">
                                <ul className="list-unstyled p-0 m-0 overlap-avatar">
                                    <li>
                                        <Image src="/image/1.webp" alt="" width={60} height={60} />
                                    </li>
                                    <li>
                                        <Image src="/image/2.webp" alt="" width={60} height={60} />
                                    </li>
                                    <li>
                                        <Image src="/image/3.webp" alt="" width={60} height={60} />
                                    </li>
                                </ul>
                                <div className="ms-4">
                                    <h5 className="overlap-avatar-count">5k +</h5>
                                    <p className="mb-0 small-para-14-px text-white">Reccomdations</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-7 col-lg-8 d-flex justify-content-center justify-content-md-end">
                            <div className="my-auto d-flex">
                                <div className="me-3 me-lg-5">
                                    <h5 className="text-center overlap-avatar-count">15k +</h5>
                                    <p className="mb-0 small-para-14-px text-white">Satisfied Visitors</p>
                                </div>
                                <div className="me-3 me-lg-5">
                                    <h5 className="text-center overlap-avatar-count">3.5k+</h5>
                                    <p className="mb-0 small-para-14-px text-white">Amazing Hotels</p>
                                </div>
                                <div>
                                    <h5 className="text-center overlap-avatar-count">
                                        <i className="fa-sharp fa-solid fa-tag text-theme-green flip-reverse me-2"></i>2k+
                                    </h5>
                                    <p className="mb-0 small-para-14-px text-white">Best Deals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!isCountryVariant && <div className="space-100px"></div>}

                {!isCountryVariant && (
                    <div className="text-center">
                        <h1 className="hero-heading text-white">Find the best hotel deals</h1>
                        <h4 className="small-heading-hero text-white">With Price Guardian a price robot on your side</h4>
                    </div>
                )}
                {!isCountryVariant && <div className="space-100px"></div>}

                <div className="d-block d-md-none w-100 mb-2">
                    <SearchSummaryBar>
                        <form onSubmit={(e) => {
                            setGuests(tempGuests);
                            setRooms(tempRooms);
                            handleSearchSubmit(e, { guests: tempGuests, rooms: tempRooms });
                        }}>
                            <div className="d-flex flex-column gap-3">
                                {/* Destination */}
                                <div className="position-relative" ref={searchRef}>
                                    <label className="form-label fw-semibold mb-1 d-flex align-items-center gap-1 mobile-modal-label">
                                        <svg width="14" height="14" fill="none" stroke="#1d4db3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {isCountryVariant ? 'Destination or Hotel Name' : 'Hotel Name'}
                                    </label>
                                    <div className="input-group rounded-3 overflow-hidden mobile-search-input-group">
                                        <span className="input-group-text bg-white border-0 pe-0"><i className="fa-solid fa-magnifying-glass mobile-search-icon"></i></span>
                                        <input 
                                            type="text" 
                                            placeholder="Type city/ZipCode"
                                            value={query}
                                            onChange={(e) => {
                                                isSelectingRef.current = false;
                                                setQuery(e.target.value);
                                            }}
                                            className="form-control border-0 mobile-search-input"
                                        />
                                    </div>
                                    {show && (
                                        <div className="list-group position-absolute mt-1 w-100 shadow rounded-3 overflow-hidden mobile-search-results">
                                            {loading && (
                                                <div className="list-group-item py-2 text-center border-0">
                                                    <span className="spinner-border spinner-border-sm mobile-spinner" />
                                                </div>
                                            )}
                                            {!loading && results.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className="list-group-item list-group-item-action d-flex justify-content-between border-0 py-2"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    <span className="text-truncate">{item.displayText}</span>
                                                    <small className="text-muted ms-2 flex-shrink-0">{item.type}</small>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div ref={datePickerRef} className="position-relative mobile-date-picker-field">
                                    <label className="form-label fw-semibold mb-1 d-flex align-items-center gap-1 mobile-modal-label">
                                        <svg width="14" height="14" fill="none" stroke="#1d4db3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        Check-In and Check-Out
                                    </label>
                                    <div 
                                        className="d-flex align-items-center rounded-4 px-3 mobile-calendar-input" 
                                        onClick={handleToggleMobileDatePicker}
                                    >
                                        <i className="fa-regular fa-calendar me-2 mobile-calendar-icon"></i>
                                        <span>{checkInDate ? formatDate(checkInDate) : ''} - {checkOutDate ? formatDate(checkOutDate) : ''}</span>
                                    </div>
                                    {showDatePicker && (
                                        <div className="date-range-picker-popup mobile-date-range-picker-popup">
                                            <div className="calendar-container">
                                                <DatePicker
                                                    selected={tempCheckInDate}
                                                    onChange={handleDateChange}
                                                    startDate={tempCheckInDate}
                                                    endDate={tempCheckOutDate}
                                                    selectsRange
                                                    inline
                                                    monthsShown={2}
                                                    monthsPerRow={1}
                                                    minDate={new Date()}
                                                    dateFormat="MM/dd/yyyy"
                                                    showPopperArrow={false}
                                                    calendarClassName={`custom-date-range-calendar${mobileCalendarPickerMode ? ' mobile-calendar-picking' : ''}`}
                                                    renderCustomHeader={({
                                                        date,
                                                        decreaseMonth,
                                                        increaseMonth,
                                                        changeMonth,
                                                        changeYear,
                                                        prevMonthButtonDisabled,
                                                        nextMonthButtonDisabled,
                                                        customHeaderCount
                                                    }) => {
                                                        const headerYear = date.getFullYear();
                                                        const today = new Date();
                                                        const currentYear = today.getFullYear();
                                                        const currentMonth = today.getMonth();
                                                        const yearStart = Math.max(currentYear, headerYear - 5);
                                                        const yearOptions = Array.from({ length: 12 }, (_, index) => yearStart + index);
                                                        const availableMonths =
                                                            headerYear === currentYear
                                                                ? monthNames.map((month, index) => ({ month, index })).filter(({ index }) => index >= currentMonth)
                                                                : monthNames.map((month, index) => ({ month, index }));
                                                        const isPrimaryHeader = customHeaderCount === 0;

                                                        return (
                                                            <div className={`mobile-calendar-header${!isPrimaryHeader ? ' mobile-calendar-secondary-header' : ''}`}>
                                                                <div className="custom-header-wrapper">
                                                                    {isPrimaryHeader && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (mobileCalendarPickerMode) {
                                                                                    changeYear(Math.max(currentYear, headerYear - (mobileCalendarPickerMode === 'year' ? 12 : 1)));
                                                                                    return;
                                                                                }
                                                                                decreaseMonth();
                                                                            }}
                                                                            disabled={
                                                                                mobileCalendarPickerMode
                                                                                    ? headerYear <= currentYear
                                                                                    : prevMonthButtonDisabled
                                                                            }
                                                                            className="nav-button prev-month"
                                                                            aria-label={mobileCalendarPickerMode === 'month' ? 'Previous year' : 'Previous month'}
                                                                        >
                                                                            &lsaquo;
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        className={isPrimaryHeader ? 'mobile-calendar-title' : 'mobile-calendar-title mobile-calendar-title-static'}
                                                                        onClick={() => {
                                                                            if (!isPrimaryHeader) return;
                                                                            setMobileCalendarPickerMode((mode) => {
                                                                                if (!mode) return 'month';
                                                                                if (mode === 'month') return 'year';
                                                                                return 'month';
                                                                            });
                                                                        }}
                                                                    >
                                                                        {mobileCalendarPickerMode && isPrimaryHeader ? headerYear : format(date, 'MMM yyyy')}
                                                                    </button>
                                                                    {isPrimaryHeader && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (mobileCalendarPickerMode) {
                                                                                    changeYear(headerYear + (mobileCalendarPickerMode === 'year' ? 12 : 1));
                                                                                    return;
                                                                                }
                                                                                increaseMonth();
                                                                            }}
                                                                            disabled={!mobileCalendarPickerMode && nextMonthButtonDisabled}
                                                                            className="nav-button next-month"
                                                                            aria-label={mobileCalendarPickerMode === 'month' ? 'Next year' : 'Next month'}
                                                                        >
                                                                            &rsaquo;
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {isPrimaryHeader && mobileCalendarPickerMode === 'month' && (
                                                                    <div className="mobile-calendar-picker-grid">
                                                                        <div className="mobile-month-grid">
                                                                            {availableMonths.map(({ month, index }) => (
                                                                                <button
                                                                                    key={month}
                                                                                    type="button"
                                                                                    className={`mobile-picker-option${index === date.getMonth() ? ' active' : ''}`}
                                                                                    onClick={() => {
                                                                                        changeMonth(index);
                                                                                        setMobileCalendarPickerMode(null);
                                                                                    }}
                                                                                >
                                                                                    {month}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {isPrimaryHeader && mobileCalendarPickerMode === 'year' && (
                                                                    <div className="mobile-calendar-picker-grid">
                                                                        <div className="mobile-year-grid">
                                                                            {yearOptions.map((year) => (
                                                                                <button
                                                                                    key={year}
                                                                                    type="button"
                                                                                    className={`mobile-picker-option${year === headerYear ? ' active' : ''}`}
                                                                                    onClick={() => {
                                                                                        changeYear(year);
                                                                                        setMobileCalendarPickerMode('month');
                                                                                    }}
                                                                                >
                                                                                    {year}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <div className="selected-range-footer">
                                                    <span>{formatDate(tempCheckInDate)} - {formatDate(tempCheckOutDate)}</span>
                                                    <div className="footer-buttons">
                                                        <button type="button" className="cancel-button" onClick={() => setShowDatePicker(false)}>Cancel</button>
                                                        <button type="button" className="apply-button" onClick={() => {
                                                            setCheckInDate(tempCheckInDate);
                                                            setCheckOutDate(tempCheckOutDate);
                                                            setShowDatePicker(false);
                                                        }}>Apply</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rooms & Guests */}
                                <div className="position-relative mobile-rooms-field">
                                    <label className="form-label fw-semibold mb-2 d-flex align-items-center gap-1 mobile-modal-label">
                                        <svg width="14" height="14" fill="none" stroke="#1d4db3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        Rooms & Guests
                                    </label>
                                    <button
                                        type="button"
                                        className="d-flex align-items-center justify-content-between w-100 rounded-4 px-3 mobile-rooms-toggle"
                                        onClick={handleToggleMobileRoomsPanel}
                                        aria-expanded={showMobileRoomsPanel}
                                    >
                                        <span className="d-flex align-items-center min-w-0">
                                            <i className="fa-regular fa-user me-2 mobile-calendar-icon"></i>
                                            <span className="text-truncate">
                                                {tempGuests} adults &middot; {childrenCount} children &middot; {tempRooms} room{tempRooms === 1 ? '' : 's'}
                                            </span>
                                        </span>
                                        <i className={`fa-solid fa-chevron-${showMobileRoomsPanel ? 'up' : 'down'} ms-2 flex-shrink-0`}></i>
                                    </button>
                                    {showMobileRoomsPanel && (
                                        <div className="p-3 rounded-4 mobile-rooms-box">
                                            <div className="mb-3">
                                                <label className="form-label custom-form-label mb-1">Rooms</label>
                                                <select className="form-select" value={tempRooms} onChange={(e) => updateTempRooms(Number(e.target.value))}>
                                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => <option key={value} value={value}>{value}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label custom-form-label mb-1">Guests</label>
                                                <select className="form-select" value={tempGuests} onChange={(e) => updateTempGuests(Number(e.target.value))}>
                                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => <option key={value} value={value}>{value}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label custom-form-label mb-1">Children</label>
                                                <select className="form-select" value={childrenCount} onChange={(e) => updateChildrenCount(Number(e.target.value))}>
                                                    {Array.from({ length: 11 }, (_, i) => i).map((value) => <option key={value} value={value}>{value}</option>)}
                                                </select>
                                            </div>
                                            {childrenCount > 0 && (
                                                <div>
                                                    <p className="custom-form-label mb-2">Children Age</p>
                                                    <div className="row g-2">
                                                        {childrenAges.map((age, index) => (
                                                            <div key={index} className="col-4">
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={age}
                                                                    onChange={(e) => handleAgeChange(index, e.target.value)}
                                                                >
                                                                    {[...Array(18)].map((_, i) => (
                                                                        <option key={i} value={i}>{i}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-end gap-2 pt-3">
                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    onClick={() => setShowMobileRoomsPanel(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="apply-button"
                                                    onClick={() => {
                                                        setGuests(tempGuests);
                                                        setRooms(tempRooms);
                                                        setShowMobileRoomsPanel(false);
                                                    }}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Search Button */}
                                <button 
                                    type="submit"
                                    className="btn btn-lg w-100 fw-bold shadow mt-2 border-0 rounded-3 mobile-search-submit"
                                >
                                    See Deals Now
                                </button>
                            </div>
                        </form>
                    </SearchSummaryBar>
                </div>

                <div className={heroShellClassName}>
                    <form action="#" onSubmit={handleSearchSubmit}>
                        <div className={heroSearchRowClassName} style={isCountryVariant ? { gap: '11px 0' } : undefined}>
                            <div
                                className="col-12 col-md-4 col-lg-3 mb-3 mb-lg-0 position-relative hero-search-col hotel-search-col"
                                ref={searchRef}
                            >
                                <label className="form-label custom-form-label text-white">
                                    {isCountryVariant ? 'Destination or Hotel Name' : 'Hotel Name'}
                                </label>

                                <div className="input-group custom-input-group-textbox">
                                    <span className="input-group-text bg-white">
                                        {/* <i className="fa-solid fa-magnifying-glass"></i> */}
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type city/ZipCode"
                                        value={query}
                                        onChange={(e) => {
                                            isSelectingRef.current = false;
                                            setQuery(e.target.value);
                                        }}
                                    />
                                </div>

                                {show && (
                                    <div className="list-group position-absolute mt-1 w-100 hero-search-results-dropdown">
                                        {loading ? (
                                            <div className="list-group-item py-2 text-center">
                                                <span className="spinner-border spinner-border-sm" />
                                            </div>
                                        ) : (
                                            results.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className="list-group-item list-group-item-action d-flex justify-content-between"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    <span className="text-truncate">{item.displayText}</span>
                                                    <small className="text-muted">{item.type}</small>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0 hero-search-col date-search-col" ref={datePickerRef}>
                                <label htmlFor="daterange" className="form-label custom-form-label text-white">
                                    Check-In and Check-Out
                                </label>
                                <div className="date-picker-wrapper">
                                    <div className="main-date-picker" onClick={handleOpenDatePicker}>
                                        <div className="date-range-input-content">
                                            <div className="date-range-labels">
                                                <div className="check-in-out-label">
                                                    <span className="date-text">
                                                        {checkInDate ? formatDate(checkInDate) : ''} -{' '}
                                                        {checkOutDate ? formatDate(checkOutDate) : ''}
                                                    </span>
                                                </div>

                                                <span
                                                    className="date-range-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDatePicker();
                                                    }}
                                                ></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Range Picker Popup */}
                                    {showDatePicker && (
                                        <div className="date-range-picker-popup">
                                            <div className="calendar-container">
                                                <DatePicker
                                                    selected={tempCheckInDate}
                                                    onChange={handleDateChange}
                                                    startDate={tempCheckInDate}
                                                    endDate={tempCheckOutDate}
                                                    selectsRange
                                                    inline
                                                    monthsShown={2}
                                                    minDate={new Date()}
                                                    dateFormat="MM/dd/yyyy"
                                                    showPopperArrow={false}
                                                    calendarClassName="custom-date-range-calendar"
                                                    renderCustomHeader={({
                                                        date,
                                                        decreaseMonth,
                                                        increaseMonth,
                                                        prevMonthButtonDisabled,
                                                        nextMonthButtonDisabled,
                                                        customHeaderCount
                                                    }) => {
                                                        const isFirstMonth = customHeaderCount === 0;
                                                        const isSecondMonth = customHeaderCount === 1;

                                                        const displayDate = isSecondMonth ? addMonths(date, 1) : date;

                                                        return (
                                                            <div className="custom-header-wrapper">
                                                                {isFirstMonth && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={decreaseMonth}
                                                                        disabled={prevMonthButtonDisabled}
                                                                        className="nav-button prev-month"
                                                                    >
                                                                        ‹
                                                                    </button>
                                                                )}

                                                                <div className="month-year-display">{format(displayDate, 'MMM yyyy')}</div>

                                                                {isSecondMonth && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={increaseMonth}
                                                                        disabled={nextMonthButtonDisabled}
                                                                        className="nav-button next-month"
                                                                    >
                                                                        ›
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <div className="selected-range-footer">
                                                    <span>
                                                        {formatDate(tempCheckInDate)} - {formatDate(tempCheckOutDate)}
                                                    </span>

                                                    <div className="footer-buttons">
                                                        <button
                                                            type="button"
                                                            className="cancel-button"
                                                            onClick={() => setShowDatePicker(false)}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="apply-button"
                                                            onClick={() => {
                                                                setCheckInDate(tempCheckInDate);
                                                                setCheckOutDate(tempCheckOutDate);
                                                                setShowDatePicker(false);
                                                            }}
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-lg-0 hero-search-col rooms-search-col" ref={roomsDropdownRef}>
                                <label htmlFor="daterange" className="form-label custom-form-label text-white">
                                    Rooms & Guests
                                </label>
                                <button
                                    className="dropdown-toggle rooms-guest-dd"
                                    type="button"
                                    id="languageSwitcher"
                                    aria-expanded={showRoomsDropdown}
                                    onClick={() => setShowRoomsDropdown((prev) => !prev)}
                                >
                                    <span className="me-2">{getRoomsGuestsLabel()}</span>
                                </button>
                                <div
                                    className={`dropdown-menu language-switcher-menu-item${showRoomsDropdown ? ' show' : ''}`}
                                    aria-labelledby="dropdownMenuButton"
                                >
                                    <div className="py-3 px-4 d-none d-md-block">
                                        <div className="mb-3">
                                            <label htmlFor="rooms" className="form-label custom-form-label">
                                                Rooms
                                            </label>
                                            <select
                                                className="form-select custom-input-select-rooms-guest-dd"
                                                id="rooms"
                                                value={tempRooms}
                                                onChange={(e) => setTempRooms(Number(e.target.value))}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5+</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="guest" className="form-label custom-form-label">
                                                Guests
                                            </label>
                                            <select
                                                className="form-select custom-input-select-rooms-guest-dd"
                                                id="guest"
                                                value={tempGuests}
                                                onChange={(e) => setTempGuests(Number(e.target.value))}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5+</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label custom-form-label">Children</label>
                                            <select
                                                className="form-select custom-input-select-rooms-guest-dd"
                                                value={childrenCount}
                                                onChange={(e) => updateChildrenCount(Number(e.target.value))}
                                            >
                                                {[...Array(11)].map((_, i) => (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {childrenCount > 0 && (
                                            <div className="mb-3">
                                                <label className="form-label custom-form-label">Children Age</label>
                                                <div className="row g-2">
                                                    {childrenAges.map((age, index) => (
                                                        <div key={index} className="col-4">
                                                            <select
                                                                className="dropdown-toggle rooms-guest-dd-tt form-select custom-input-select-children-dd"
                                                                value={age}
                                                                onChange={(e) => handleAgeChange(index, e.target.value)}
                                                            >
                                                                {[...Array(28)].map((_, i) => (
                                                                    <option key={i} value={i}>
                                                                        {i}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="theme-button-orange rounded rounded rounded rounded w-100"
                                            onClick={() => {
                                                setGuests(tempGuests);
                                                setRooms(tempRooms);
                                                setShowRoomsDropdown(false);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    <div className="py-3 px-4 d-flex d-md-none flex-column ">
                                        <div className="number number-in-dec mx-auto mb-4">
                                            <p className="custom-form-label mb-2">Rooms</p>
                                            <button type="button" className="minus" onClick={() => updateTempRooms(tempRooms - 1)}>
                                                -
                                            </button>
                                            <input type="text" className="para" value={tempRooms} readOnly />
                                            <button type="button" className="plus" onClick={() => updateTempRooms(tempRooms + 1)}>
                                                +
                                            </button>
                                        </div>
                                        <div className="number number-in-dec mx-auto mb-4">
                                            <p className="custom-form-label mb-2">Guests</p>
                                            <button type="button" className="minus" onClick={() => updateTempGuests(tempGuests - 1)}>
                                                -
                                            </button>
                                            <input type="text" className="para" value={tempGuests} readOnly />
                                            <button type="button" className="plus" onClick={() => updateTempGuests(tempGuests + 1)}>
                                                +
                                            </button>
                                        </div>
                                        <div className="number number-in-dec mx-auto mb-4">
                                            <p className="custom-form-label mb-2">Children</p>
                                            <button type="button" className="minus" onClick={() => updateChildrenCount(childrenCount - 1)}>
                                                -
                                            </button>
                                            <input type="text" className="para" value={childrenCount} readOnly />
                                            <button type="button" className="plus" onClick={() => updateChildrenCount(childrenCount + 1)}>
                                                +
                                            </button>
                                        </div>
                                        {childrenCount > 0 && (
                                            <div className="mb-4">
                                                <p className="custom-form-label mb-2 text-center">Children Age</p>
                                                <div className="row g-2">
                                                    {childrenAges.map((age, index) => (
                                                        <div key={index} className="col-4">
                                                            <select
                                                                className="dropdown-toggle rooms-guest-dd form-select custom-input-select-children-dd"
                                                                value={age}
                                                                onChange={(e) => handleAgeChange(index, e.target.value)}
                                                            >
                                                                {[...Array(18)].map((_, i) => (
                                                                    <option key={i} value={i}>
                                                                        {i}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button type="button" className="theme-button-orange rounded rounded rounded rounded w-100">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3 col-md-1 col-lg-1 mb-0 mb-lg-0 hero-search-col filter-search-col">
                                <label className="custom-form-label text-white form-label-maring-bottom">Filter</label>
                                <div
                                    className={`filter-button d-flex cursor-pointer${showFilters ? ' active' : ''}`}
                                    id="filterButton"
                                    ref={filterButtonRef}
                                    onClick={() => setShowFilters((prev) => !prev)}
                                >
                                    <Image src="/image/filter.webp" className="m-auto" alt="" width={24} height={24} />
                                </div>
                            </div>
                            <div className="col-9 col-md-5 col-lg-3 mb-0 mb-lg-0 d-flex hero-search-col submit-search-col">
                                <button
                                    type="submit"
                                    className={`theme-button-orange rounded font-weight-bold-submit-search${isCountryVariant ? ' submit-search' : ''}`}
                                >
                                    See Deals Now
                                </button>
                            </div>
                        </div>
                        {showFilters && (
                            <div className="advaance-form-field-wrap mt-4 p-3 p-md-5" id="filterSection" ref={filterRef}>
                                <div className="row">
                                    <div className="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <div className="mb-5">
                                            <h4 className="property-grid-title mb-2">Price Range</h4>
                                            <p className="small-para-14-px">
                                                AUD {priceRange.min} to AUD {priceRange.max}
                                            </p>
                                            <div
                                                id="price-slider-track"
                                                className="slider-track position-relative price-slider-track"
                                            >
                                                <div
                                                    className="slider-selected price-slider-selected"
                                                    style={{
                                                        left: `${valueToPercent(priceRange.min)}%`,
                                                        width: `${valueToPercent(priceRange.max) - valueToPercent(priceRange.min)}%`
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className="position-relative price-slider-handle-wrapper"
                                                onMouseUp={handleSliderMouseUp}
                                            >
                                                <div
                                                    onMouseDown={() => handleSliderMouseDown('min')}
                                                    className="price-slider-handle"
                                                    style={{
                                                        left: `${valueToPercent(priceRange.min)}%`
                                                    }}
                                                    title={`AUD ${priceRange.min}`}
                                                    tabIndex={0}
                                                />
                                                <div
                                                    onMouseDown={() => handleSliderMouseDown('max')}
                                                    className="price-slider-handle"
                                                    style={{
                                                        left: `${valueToPercent(priceRange.max)}%`
                                                    }}
                                                    title={`AUD ${priceRange.max}`}
                                                    tabIndex={0}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="property-grid-title mb-2">Rating</h4>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="5" id="rating5" />
                                                <label className="form-check-label rating my-auto" htmlFor="rating5">
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="4" id="rating4" />
                                                <label className="form-check-label rating my-auto" htmlFor="rating4">
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />{' '}
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="3" id="rating3" />
                                                <label className="form-check-label my-auto rating" htmlFor="rating3">
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="2" id="rating2" />
                                                <label className="form-check-label my-auto rating" htmlFor="rating2">
                                                    <MdOutlineStarPurple500 size={22} />
                                                    <MdOutlineStarPurple500 size={22} />{' '}
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="1" id="rating1" />
                                                <label className="form-check-label my-auto rating" htmlFor="rating1">
                                                    <MdOutlineStarPurple500 size={22} />{' '}
                                                </label>
                                            </div>
                                            <div className="form-check d-flex">
                                                <input className="form-check-input my-auto" type="checkbox" value="1" id="unrated" />
                                                <label className="form-check-label my-auto custom-form-label" htmlFor="unrated">
                                                    Unrated Property
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <div>
                                            <h4 className="property-grid-title mb-2">Property Type</h4>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="2" id="2bed" />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="2bed">
                                                    2 bedroom apartments
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="3" id="3bed" />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="3bed">
                                                    3 bedroom apartments
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="AirportShuttle"
                                                    id="AirportShuttle"
                                                />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="AirportShuttle">
                                                    Airport Shuttle
                                                </label>
                                            </div>
                                            <div className="form-check d-flex">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="AllServicedApartments"
                                                    id="AllServicedApartments"
                                                />
                                                <label
                                                    className="form-check-label my-auto custom-form-label"
                                                    htmlFor="AllServicedApartments"
                                                >
                                                    All Serviced Apartments
                                                </label>
                                            </div>
                                            <div className="text-start mt-2 ps-4 ms-2">
                                                <a href="#" className="small-para-14-px text-blue">
                                                    +show more
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <div>
                                            <h4 className="property-grid-title mb-2">Facilities</h4>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="Conferencefacilities"
                                                    id="Conferencefacilities"
                                                />
                                                <label
                                                    className="form-check-label custom-form-label my-auto"
                                                    htmlFor="Conferencefacilities"
                                                >
                                                    Conference facilities
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="FreeWiFi"
                                                    id="FreeWiFi"
                                                />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="FreeWiFi">
                                                    Free WiFi Internet Access
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="Parking" id="Parking" />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="Parking">
                                                    Parking
                                                </label>
                                            </div>
                                            <div className="form-check d-flex">
                                                <input className="form-check-input my-auto" type="checkbox" value="DaySpa" id="DaySpa" />
                                                <label className="form-check-label my-auto custom-form-label" htmlFor="DaySpa">
                                                    Day Spa
                                                </label>
                                            </div>
                                            <div className="text-start mt-2 ps-4 ms-2">
                                                <a href="#" className="small-para-14-px text-blue">
                                                    +show more
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <div>
                                            <h4 className="property-grid-title mb-2">Entertainment</h4>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="BarbequeBBQ"
                                                    id="BarbequeBBQ"
                                                />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="BarbequeBBQ">
                                                    Barbeque BBQ
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input className="form-check-input my-auto" type="checkbox" value="Casino" id="Casino" />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="Casino">
                                                    Casino
                                                </label>
                                            </div>
                                            <div className="form-check d-flex mb-2 pb-1">
                                                <input
                                                    className="form-check-input my-auto"
                                                    type="checkbox"
                                                    value="Golfcourse"
                                                    id="Golfcourse"
                                                />
                                                <label className="form-check-label custom-form-label my-auto" htmlFor="Golfcourse">
                                                    Golf Course
                                                </label>
                                            </div>
                                            <div className="form-check d-flex">
                                                <input className="form-check-input my-auto" type="checkbox" value="Gym" id="Gym" />
                                                <label className="form-check-label my-auto custom-form-label" htmlFor="Gym">
                                                    Gym
                                                </label>
                                            </div>
                                            <div className="text-start mt-2 ps-4 ms-2">
                                                <a href="#" className="small-para-14-px text-blue">
                                                    +show more
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
