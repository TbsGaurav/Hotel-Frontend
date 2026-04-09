'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
function WeekendGetawayHotelSection() {
    const [activeCity, setActiveCity] = useState('Adelaide');

    const cities = ['Adelaide', 'Brisbane', 'Canberra', 'Hobart', 'Perth', 'Melbourne', 'Sydney'];

    const hotelsByCity = {
        Adelaide: [
            {
                name: 'Miller Apartments',
                address: '16 Hindley Street Adelaide',
                oldPrice: 'AUD $673',
                price: 'AUD $354',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Adelaide',
                address: '233 Victoria Square Adelaide',
                oldPrice: 'AUD $690',
                price: 'AUD $370',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Glenelg Plaza',
                address: '16 Hindley Street Adelaide',
                oldPrice: 'AUD $610',
                price: 'AUD $320',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Glenelg Plaza',
                address: '16 Hindley Street Adelaide',
                oldPrice: 'AUD $610',
                price: 'AUD $320',
                image: '/image/property-img.webp'
            }
        ],

        Brisbane: [
            {
                name: 'Brisbane Marriott',
                address: '515 Queen St Brisbane',
                oldPrice: 'AUD $700',
                price: 'AUD $390',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Brisbane',
                address: '190 Elizabeth St Brisbane',
                oldPrice: 'AUD $650',
                price: 'AUD $360',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Brisbane',
                address: '347 Ann St Brisbane',
                oldPrice: 'AUD $620',
                price: 'AUD $340',
                image: '/image/property-img.webp'
            }
        ],

        Canberra: [
            {
                name: 'Brisbane Marriott',
                address: '515 Queen St Brisbane',
                oldPrice: 'AUD $700',
                price: 'AUD $390',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Brisbane',
                address: '190 Elizabeth St Brisbane',
                oldPrice: 'AUD $650',
                price: 'AUD $360',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Brisbane',
                address: '347 Ann St Brisbane',
                oldPrice: 'AUD $620',
                price: 'AUD $340',
                image: '/image/property-img.webp'
            }
        ],

        // Gold Coast: [
        //     {
        //         name: 'Brisbane Marriott',
        //         address: '515 Queen St Brisbane',
        //         oldPrice: 'AUD $700',
        //         price: 'AUD $390',
        //         image: '/image/property-img.webp'
        //     },
        //     {
        //         name: 'Hilton Brisbane',
        //         address: '190 Elizabeth St Brisbane',
        //         oldPrice: 'AUD $650',
        //         price: 'AUD $360',
        //         image: '/image/property-img.webp'
        //     },
        //     {
        //         name: 'Oaks Brisbane',
        //         address: '347 Ann St Brisbane',
        //         oldPrice: 'AUD $620',
        //         price: 'AUD $340',
        //         image: '/image/property-img.webp'
        //     }
        // ],
        Hobart: [
            {
                name: 'Brisbane Marriott',
                address: '515 Queen St Brisbane',
                oldPrice: 'AUD $700',
                price: 'AUD $390',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Brisbane',
                address: '190 Elizabeth St Brisbane',
                oldPrice: 'AUD $650',
                price: 'AUD $360',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Brisbane',
                address: '347 Ann St Brisbane',
                oldPrice: 'AUD $620',
                price: 'AUD $340',
                image: '/image/property-img.webp'
            }
        ],
        Perth: [
            {
                name: 'Brisbane Marriott',
                address: '515 Queen St Brisbane',
                oldPrice: 'AUD $700',
                price: 'AUD $390',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Brisbane',
                address: '190 Elizabeth St Brisbane',
                oldPrice: 'AUD $650',
                price: 'AUD $360',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Brisbane',
                address: '347 Ann St Brisbane',
                oldPrice: 'AUD $620',
                price: 'AUD $340',
                image: '/image/property-img.webp'
            }
        ],
        Melbourne: [
            {
                name: 'Brisbane Marriott',
                address: '515 Queen St Brisbane',
                oldPrice: 'AUD $700',
                price: 'AUD $390',
                image: '/image/property-img.webp'
            },
            {
                name: 'Hilton Brisbane',
                address: '190 Elizabeth St Brisbane',
                oldPrice: 'AUD $650',
                price: 'AUD $360',
                image: '/image/property-img.webp'
            },
            {
                name: 'Oaks Brisbane',
                address: '347 Ann St Brisbane',
                oldPrice: 'AUD $620',
                price: 'AUD $340',
                image: '/image/property-img.webp'
            }
        ],
        Sydney: [
            {
                name: 'Hyatt Regency',
                address: '161 Sussex St Sydney',
                oldPrice: 'AUD $720',
                price: 'AUD $420',
                image: '/image/property-img.webp'
            }
        ]
    };
    const hotels = hotelsByCity[activeCity] || [];

    return (
        <section>
            <div className="container pt-5 pb-5">
                <h2 className="heading text-center">
                    Weekend Getaway <span>Hotel Deals</span>
                </h2>

                <p className="small-para-14-px text-center mb-4">
                    See the best hotel deals for this weekend and upcoming weekends across quality 4 and 5 star hotels in major capital
                    cities.
                </p>

                {/* Tabs */}
                <ul className="nav nav-pills d-flex justify-content-center flex-nowrap flex-row tabs-layout property-grid-tabs mb-5">
                    {cities.map((city) => (
                        <li key={city} className="nav-item mx-0 mx-lg-3">
                            <button className={`nav-link ${activeCity === city ? 'active' : ''}`} onClick={() => setActiveCity(city)}>
                                {city}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="position-relative overflow-visible">
                    <div className="custom-prev">
                        <i className="fa-solid fa-chevron-left"></i>
                    </div>

                    {/* RIGHT BUTTON */}
                    <div className="custom-next">
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <Swiper
                        modules={[Navigation]}
                        slidesPerView={3}
                        spaceBetween={35}
                        loop
                        navigation={{
                            prevEl: '.custom-prev',
                            nextEl: '.custom-next'
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 }
                        }}
                    >
                        {hotels.map((hotel, index) => (
                            <SwiperSlide key={index} style={{ padding: '15px 5px' }}>
                                {' '}
                                <div
                                    className="property-grid-box p-2"
                                    style={{
                                        borderRadius: '18px',
                                        background: '#fff',
                                        border: '1px solid #e9ecef',
                                        maxWidth: '420px',
                                        margin: '0 auto',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Swiper
                                        modules={[Autoplay, Pagination]}
                                        slidesPerView={1}
                                        loop
                                        autoplay={{
                                            delay: 4000,
                                            disableOnInteraction: false
                                        }}
                                        speed={800}
                                        pagination={{
                                            clickable: true
                                        }}
                                        className="image-swiper"
                                        style={{ borderRadius: '14px', overflow: 'hidden' }}
                                    >
                                        <SwiperSlide>
                                            <img
                                                src="/image/property-img.webp"
                                                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                            />
                                        </SwiperSlide>

                                        <SwiperSlide>
                                            <img
                                                src="/image/property-img.webp"
                                                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                            />
                                        </SwiperSlide>

                                        <SwiperSlide>
                                            <img
                                                src="/image/property-img.webp"
                                                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                            />
                                        </SwiperSlide>
                                    </Swiper>

                                    {/* <div
                                        id={`hotelCarousel-${index}`}
                                        className="carousel slide position-relative mb-3"
                                        data-bs-ride="carousel"
                                        data-bs-interval="2500"
                                    >
                                        <div className="carousel-indicators">
                                            <button
                                                type="button"
                                                data-bs-target={`#hotelCarousel-${index}`}
                                                data-bs-slide-to="0"
                                                className="active"
                                            ></button>

                                            <button type="button" data-bs-target={`#hotelCarousel-${index}`} data-bs-slide-to="1"></button>

                                            <button type="button" data-bs-target={`#hotelCarousel-${index}`} data-bs-slide-to="2"></button>
                                        </div>

                                        <div className="carousel-inner rounded-4">
                                            <div className="carousel-item active">
                                                <img
                                                    src="/image/property-img.webp"
                                                    className="d-block w-100"
                                                    style={{
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '14px'
                                                    }}
                                                />
                                            </div>

                                            <div className="carousel-item">
                                                <img
                                                    src="/image/property-img.webp"
                                                    className="d-block w-100"
                                                    style={{ height: '220px', objectFit: 'cover' }}
                                                />
                                            </div>

                                            <div className="carousel-item">
                                                <img
                                                    src="/image/property-img.webp"
                                                    className="d-block w-100"
                                                    style={{ height: '220px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="card-content">
                                        <div className="d-flex mb-2">
                                            <h4 className="property-grid-title my-auto me-3">{hotel.name}</h4>

                                            <div className="rating my-auto text-warning">
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                            </div>
                                        </div>

                                        <p className="small-para-14-px text-black mb-3">{hotel.address}</p>

                                        {/* <div className="row mb-4"> */}
                                        <div className="d-flex justify-content-between align-items-end mb-3">
                                            <div>
                                                <p className="text-decoration-line-through small-para-14-px text-muted mb-0">
                                                    {hotel.oldPrice}
                                                </p>
                                                <p className="para text-theme-green mb-0">{hotel.price}</p>
                                            </div>

                                            <p className="small-para-14-px mb-0">1 night, 2 adults</p>
                                        </div>

                                        <a href="#" className="theme-button-blue rounded w-100 text-center">
                                            Book Now
                                        </a>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default WeekendGetawayHotelSection;
