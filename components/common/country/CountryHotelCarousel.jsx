// 'use client';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { useId } from 'react';

// export default function CountryHotelCarousel({}) {
//     const hotels = [
//         {
//             name: 'The Gums Anchorage',
//             address: '97 Sylvan Beach Esplanade Bellara 4507',
//             images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
//         },

//         {
//             name: 'The Gums Anchorage',
//             address: '97 Sylvan Beach Esplanade Bellara 4507',
//             images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
//         },

//         {
//             name: 'The Gums Anchorage',
//             address: '97 Sylvan Beach Esplanade Bellara 4507',
//             images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
//         }
//     ];

//     const carouselId = useId();

//     return (
//         <section className="py-5">
//             <div className="container">
//                 <h2 className="heading text-center mb-5">
//                     A Selection of the <span>Best Hotels</span>
//                 </h2>

//                 <div className="position-relative overflow-visible">
//                     <div className="custom-prev">
//                         <i className="fa-solid fa-chevron-left"></i>
//                     </div>

//                     {/* RIGHT BUTTON */}
//                     <div className="custom-next">
//                         <i className="fa-solid fa-chevron-right"></i>
//                     </div>
//                     <Swiper
//                         modules={[Navigation]}
//                         slidesPerView={3}
//                         spaceBetween={35}
//                         loop
//                         navigation={{
//                             prevEl: '.custom-prev',
//                             nextEl: '.custom-next'
//                         }}
//                         breakpoints={{
//                             0: { slidesPerView: 1 },
//                             768: { slidesPerView: 2 },
//                             1200: { slidesPerView: 3 }
//                         }}
//                     >
//                         {hotels.map((hotel, index) => (
//                             <SwiperSlide key={index} style={{ padding: '15px 5px' }}>
//                                 {' '}
//                                 <div
//                                     className="property-grid-box p-2"
//                                     style={{
//                                         borderRadius: '18px',
//                                         background: '#fff',
//                                         border: '1px solid #e9ecef',
//                                         maxWidth: '420px',
//                                         margin: '0 auto',
//                                         overflow: 'hidden'
//                                     }}
//                                 >
//                                     <Swiper
//                                         modules={[Autoplay, Pagination]}
//                                         slidesPerView={1}
//                                         loop
//                                         autoplay={{
//                                             delay: 4000,
//                                             disableOnInteraction: false
//                                         }}
//                                         speed={800}
//                                         pagination={{
//                                             clickable: true
//                                         }}
//                                         className="image-swiper"
//                                         style={{ borderRadius: '14px', overflow: 'hidden' }}
//                                     >
//                                         <SwiperSlide>
//                                             <img
//                                                 src="/image/property-img.webp"
//                                                 style={{ height: '200px', width: '100%', objectFit: 'cover' }}
//                                             />
//                                         </SwiperSlide>

//                                         <SwiperSlide>
//                                             <img
//                                                 src="/image/property-img.webp"
//                                                 style={{ height: '200px', width: '100%', objectFit: 'cover' }}
//                                             />
//                                         </SwiperSlide>

//                                         <SwiperSlide>
//                                             <img
//                                                 src="/image/property-img.webp"
//                                                 style={{ height: '200px', width: '100%', objectFit: 'cover' }}
//                                             />
//                                         </SwiperSlide>
//                                     </Swiper>

//                                     <div className="property-grid-box p-3 bg-white border-radius-10px">
//                                         {/* Image Carousel */}
//                                         <div
//                                             id={`carousel-${carouselId}`}
//                                             className="carousel slide position-relative"
//                                             data-bs-ride="carousel"
//                                             data-bs-interval="2000"
//                                         >
//                                             {/* Indicators INSIDE image */}
//                                             <div className="carousel-indicators custom-indicators">
//                                                 {hotel.images.map((_, i) => (
//                                                     <button
//                                                         key={i}
//                                                         type="button"
//                                                         data-bs-target={`#carousel-${carouselId}`}
//                                                         data-bs-slide-to={i}
//                                                         className={i === 0 ? 'active' : ''}
//                                                     />
//                                                 ))}
//                                             </div>

//                                             <div className="carousel-inner rounded-3 overflow-hidden">
//                                                 {hotel.images.map((img, i) => (
//                                                     <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
//                                                         <img
//                                                             src={img}
//                                                             className="d-block w-100"
//                                                             alt="hotel"
//                                                             style={{
//                                                                 height: '220px',
//                                                                 objectFit: 'cover'
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* Content */}
//                                         <div className="pt-3">
//                                             <div className="d-flex justify-content-between align-items-center mb-2">
//                                                 <h5 className="property-grid-title mb-0">{hotel.name}</h5>

//                                                 <div className="rating">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <i key={i} className="fa-solid fa-star text-warning"></i>
//                                                     ))}
//                                                 </div>
//                                             </div>

//                                             <p className="small-para-14-px mb-3">{hotel.address}</p>

//                                             <button className="theme-button-blue w-100" style={{ borderRadius: '4px' }}>
//                                                 More Info
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>

//                 {/* <Swiper
//                     modules={[Navigation]}
//                     navigation
//                     spaceBetween={25}
//                     slidesPerView={3}
//                     breakpoints={{
//                         0: { slidesPerView: 1 },
//                         768: { slidesPerView: 2 },
//                         1200: { slidesPerView: 3 }
//                     }}
//                 >
//                     {hotels.map((hotel, index) => (
//                         <SwiperSlide key={index}>
//                             <div className="justify-content-center">
//                                 <HotelCard hotel={hotel} />
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper> */}
//             </div>
//         </section>
//     );
// }

'use client';

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
                                <div
                                    className="property-card"
                                    style={{
                                        borderRadius: '18px',
                                        background: '#fff',
                                        border: '1px solid #e9ecef',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <div style={{ padding: '12px' }}>
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
                                                    <img
                                                        src={img}
                                                        alt="hotel"
                                                        style={{
                                                            width: '100%',
                                                            height: '200px',
                                                            objectFit: 'cover',
                                                            borderRadius: '12px'
                                                        }}
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
                                        <button className="theme-button-blue w-100" style={{ borderRadius: '4px' }}>
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
