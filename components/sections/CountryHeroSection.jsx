'use client';

import { addMonths, format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { LuCalendarRange } from 'react-icons/lu';
import 'react-datepicker/dist/react-datepicker.css';
import '../../public/assets/css/DatePicker.css';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { globalSearchapi } from '@/lib/api/public/globalsearchapi';

function CountryHeroSection({}) {
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempCheckInDate, setTempCheckInDate] = useState(new Date());
    const [tempCheckOutDate, setTempCheckOutDate] = useState(new Date());
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);
    const [tempGuests, setTempGuests] = useState(2);
    const [tempRooms, setTempRooms] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [childrenAges, setChildrenAges] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);
    const isSelectingRef = useRef(false);

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
    const [priceRange, setPriceRange] = useState({
        min: 100,
        max: 600
    });

    const MIN_PRICE = 0;
    const MAX_PRICE = 1000;

    const valueToPercent = (value) => ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    const [isSliding, setIsSliding] = useState(null);

    const datePickerRef = useRef(null);
    const searchRef = useRef(null);

    const handleSelect = (item) => {
        isSelectingRef.current = true;
        // setSelectedLocation(item);
        setQuery(item.displayText);
        setShow(false);
    };
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setTempCheckInDate(start);
        setTempCheckOutDate(end);

        // if (start && end) {
        //     setCheckInDate(start);
        //     setCheckOutDate(end);
        //     setShowDatePicker(false);
        // }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return format(date, 'MM/dd/yyyy');
    };

    const handleOpenDatePicker = () => {
        setTempCheckInDate(checkInDate);
        setTempCheckOutDate(checkOutDate);
        setShowDatePicker(true);
    };

    const handleChildrenChange = (e) => {
        const count = Number(e.target.value);
        setChildrenCount(count);
        setChildrenAges(Array(count).fill(7));
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

    const handleSliderMouseDown = (type) => {
        setIsSliding(type);
    };

    const handleSliderMouseUp = () => {
        setIsSliding(null);
        setPriceRange({ ...priceRange });
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target) &&
                !event.target.closest('.react-datepicker') &&
                !event.target.closest('.date-range-picker-popup ')
                // !event.target.closest('.country-date-range-picker-popup ')
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
    useEffect(() => {
        function handleSearchOutsideClick(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShow(false); // close search dropdown
            }
        }

        document.addEventListener('mousedown', handleSearchOutsideClick);
        return () => document.removeEventListener('mousedown', handleSearchOutsideClick);
    }, []);
    return (
        <section className="container-fluid p-0">
            <div
                className="country-hero"
                style={{
                    backgroundColor: '#0071b9',
                    padding: '20px 0'
                }}
            >
                <div className="container p-2">
                    <form action="#">
                        <div className="row align-items-end" style={{ gap: '11px 0' }}>
                            <div className="col-10 col-md-4 col-lg-2 mb-3 mb-lg-0 position-relative" ref={searchRef}>
                                <label className="form-label custom-form-label text-white">Destination or Hotel Name</label>

                                <div className="input-group custom-input-group-textbox">
                                    <span className="input-group-text bg-white">
                                        <i className="fa-solid fa-magnifying-glass"></i>
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
                                    <div className="list-group position-absolute mt-1 w-100" style={{ zIndex: 1050 }}>
                                        {loading && (
                                            <div className="list-group-item py-2 text-center">
                                                <span className="spinner-border spinner-border-sm" />
                                            </div>
                                        )}

                                        {!loading &&
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
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0" ref={datePickerRef}>
                                <label htmlFor="daterange" className="form-label custom-form-label text-white">
                                    Check-In and Check-Out
                                </label>
                                <div className="date-picker-wrapper">
                                    <div className="main-date-picker">
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
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <LuCalendarRange />
                                                </span>
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
                                        // <div className="country-date-range-picker-popup">
                                        // <div className="date-range-picker-popup">
                                        //     <div className="calendar-container">
                                        //         <DatePicker
                                        //             selected={tempCheckInDate}
                                        //             onChange={handleDateChange}
                                        //             startDate={tempCheckInDate}
                                        //             endDate={tempCheckOutDate}
                                        //             selectsRange
                                        //             inline
                                        //             monthsShown={2}
                                        //             minDate={new Date()}
                                        //             dateFormat="MM/dd/yyyy"
                                        //             showPopperArrow={false}
                                        //             calendarClassName="custom-date-range-calendar"
                                        //             renderCustomHeader={({
                                        //                 date,
                                        //                 decreaseMonth,
                                        //                 increaseMonth,
                                        //                 prevMonthButtonDisabled,
                                        //                 nextMonthButtonDisabled,
                                        //                 customHeaderCount
                                        //             }) => {
                                        //                 let displayDate = date;
                                        //                 if (customHeaderCount === 1) {
                                        //                     displayDate = addMonths(date, 1);
                                        //                 }

                                        //                 return (
                                        //                     <div className="custom-header-wrapper">
                                        //                         <button
                                        //                             type="button"
                                        //                             onClick={decreaseMonth}
                                        //                             disabled={prevMonthButtonDisabled}
                                        //                             className="nav-button prev-month"
                                        //                         >
                                        //                             ‹
                                        //                         </button>
                                        //                         <div className="month-year-display">{format(displayDate, 'MMM yyyy')}</div>
                                        //                         <button
                                        //                             type="button"
                                        //                             onClick={increaseMonth}
                                        //                             disabled={nextMonthButtonDisabled}
                                        //                             className="nav-button next-month"
                                        //                         >
                                        //                             ›
                                        //                         </button>
                                        //                     </div>
                                        //                 );
                                        //             }}
                                        //         />
                                        //     </div>

                                        //     {/* Footer with Cancel/Apply buttons */}
                                        //     <div className="date-picker-footer">
                                        //         <div className="selected-range-footer"></div>
                                        //         <div className="footer-buttons">
                                        //             {tempCheckInDate && tempCheckOutDate
                                        //                 ? `${formatDate(tempCheckInDate)} - ${formatDate(tempCheckOutDate)}`
                                        //                 : `${formatDate(new Date())} - ${formatDate(new Date())}`}
                                        //             <button
                                        //                 type="button"
                                        //                 className="cancel-button"
                                        //                 onClick={() => {
                                        //                     setTempCheckInDate(checkInDate);
                                        //                     setTempCheckOutDate(checkOutDate);
                                        //                     setShowDatePicker(false);
                                        //                 }}
                                        //             >
                                        //                 Cancel
                                        //             </button>
                                        //             <button
                                        //                 type="button"
                                        //                 className="apply-button"
                                        //                 onClick={() => {
                                        //                     setCheckInDate(tempCheckInDate);
                                        //                     setCheckOutDate(tempCheckOutDate);
                                        //                     setShowDatePicker(false);
                                        //                 }}
                                        //             >
                                        //                 Apply
                                        //             </button>
                                        //         </div>
                                        //     </div>
                                        // </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-lg-0">
                                <label htmlFor="daterange" className="form-label custom-form-label text-white">
                                    Rooms & Guests
                                </label>
                                <button
                                    className="dropdown-toggle rooms-guest-dd"
                                    type="button"
                                    id="languageSwitcher"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="me-2">{getRoomsGuestsLabel()}</span>
                                </button>
                                <div className="dropdown-menu language-switcher-menu-item" aria-labelledby="dropdownMenuButton">
                                    <div className="py-3 px-4 d-none d-md-block">
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
                                        <button
                                            type="button"
                                            className="theme-button-orange rounded rounded rounded rounded w-100"
                                            onClick={() => {
                                                setGuests(tempGuests);
                                                setRooms(tempRooms);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    <div className="py-3 px-4 d-flex d-md-none flex-column ">
                                        <div className="number number-in-dec mx-auto mb-4">
                                            <p className="custom-form-label mb-2">Rooms</p>
                                            <span className="minus" id="minusroom">
                                                -
                                            </span>
                                            <input type="text" className="para" defaultValue="1" />
                                            <span className="plus" id="plusroom">
                                                +
                                            </span>
                                        </div>
                                        <div className="number number-in-dec mx-auto mb-4">
                                            <p className="custom-form-label mb-2">Guests</p>
                                            <span className="minus" id="minusguest">
                                                -
                                            </span>
                                            <input type="text" className="para" defaultValue="1" />
                                            <span className="plus" id="plusguest">
                                                +
                                            </span>
                                        </div>
                                        <button type="button" className="theme-button-orange rounded rounded rounded rounded w-100">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 col-md-2 col-lg-1 mb-3 mb-lg-0">
                                <label className="form-label custom-form-label text-white">Children</label>
                                <select
                                    className="dropdown-toggle rooms-guest-dd form-select custom-input-select-children-dd"
                                    value={childrenCount}
                                    onChange={handleChildrenChange}
                                >
                                    {[...Array(11)].map((_, i) => (
                                        <option key={i} value={i}>
                                            {i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-3 col-md-1 col-lg-1 mb-0 mb-lg-0">
                                <label className="custom-form-label text-white form-label-maring-bottom">Filter</label>
                                <div
                                    className="filter-button d-flex"
                                    id="filterButton"
                                    onClick={() => setShowFilters((prev) => !prev)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src="/image/filter.webp" className="m-auto" alt="" />
                                </div>
                            </div>
                            <div className="col-9 col-md-5 col-lg-3 mb-0 mb-lg-0">
                                <button
                                    type="submit"
                                    className="theme-button-orange rounded rounded rounded rounded rounded w-100 font-weight-bold-submit-search"
                                >
                                    See Deals Now
                                </button>
                            </div>
                            {childrenCount > 0 && (
                                <div className="col-12 mb-3 mb-lg-0">
                                    <label className="form-label custom-form-label text-white">Age</label>

                                    <div className="row g-2">
                                        {childrenAges.map((age, index) => (
                                            <div key={index} className="col-4 col-md-2 col-lg-1">
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
                        </div>

                        {showFilters && (
                            <div className="advaance-form-field-wrap mt-4 p-3 p-md-5" id="filterSection">
                                <div className="row">
                                    <div className="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <div className="mb-5">
                                            <h4 className="property-grid-title mb-2">Price Range</h4>
                                            <p className="small-para-14-px">
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
                                            <div
                                                className="position-relative"
                                                style={{ height: '20px', marginTop: '-13px' }}
                                                onMouseUp={handleSliderMouseUp}
                                            >
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
            {/* <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <p className="breadcrumb-text">
                            All Countries · <strong>{countryName}</strong>
                        </p>

                        <h1 className="country-hero-title">Hotel Accommodation in {countryName}</h1>

                        <p className="country-hero-subtitle">
                            Hotel accommodation at over <strong>{destinationsCount}</strong> destinations across {countryName}.
                        </p>

                        <p className="country-hero-description">{description}</p>
                    </div>

                    <div className="col-md-5 text-center">
                        <img src={heroImage} alt={countryName} className="country-hero-image" />
                    </div>
                </div>
            </div> */}
        </section>
    );
}

export default CountryHeroSection;
