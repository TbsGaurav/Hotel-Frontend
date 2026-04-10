
'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CountryHotelCarousel() {
    const hotels = [
        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        },
        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        },
        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        }
    ];

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="heading text-center mb-5">
                    A Selection of the <span>Best Hotels</span>
                </h2>

                <div className="position-relative p-2">
                    {/* Navigation Buttons */}
                    <div className="custom-prev">
                        <i className="fa-solid fa-chevron-left"></i>
                    </div>

                    <div className="custom-next">
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        slidesPerView={3}
                        spaceBetween={30}
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
                            <SwiperSlide key={index}>
                                <div className="property-card country-hotel-card">
                                    <div className="country-hotel-card-inner">
                                        <Swiper
                                            modules={[Autoplay, Pagination]}
                                            slidesPerView={1}
                                            loop
                                            autoplay={{
                                                delay: 4000,
                                                disableOnInteraction: false
                                            }}
                                            pagination={{ clickable: true }}
                                        >
                                            {hotel.images.map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <Image
                                                        src={img}
                                                        alt="hotel"
                                                        width={800}
                                                        height={400}
                                                        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 380px"
                                                        className="country-hotel-carousel-image"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                    {/* ✅ Content */}
                                    <div className="p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="mb-0 fw-semibold">{hotel.name}</h5>

                                            <div>
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className="fa-solid fa-star text-warning"></i>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-muted small mb-3">{hotel.address}</p>
                                        <button className="theme-button-blue w-100 country-hotel-more-btn">
                                            More Info
                                        </button>
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
