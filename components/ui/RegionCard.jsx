import Image from 'next/image';
import { MdOutlineStarPurple500 } from 'react-icons/md';

export default function RegionCard() {
    return (
        <div
            className="card border-0 rounded-4 mb-4 p-4"
            style={{
                boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
            }}
        >
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="position-relative">
                        {/* TAG */}
                        <span
                            className="position-absolute text-white px-3 py-1"
                            style={{
                                top: '12px',
                                right: '12px',
                                background: '#ff7a00',
                                borderRadius: '20px',
                                fontSize: '12px',
                                zIndex: 2
                            }}
                        >
                            Apartment Hotel
                        </span>
                        <div
                            id="hotelCarousel"
                            className="carousel slide rounded-4 overflow-hidden"
                            data-bs-ride="carousel"
                            data-bs-interval="2500"
                            data-bs-pause="false"
                            data-bs-wrap="true"
                        >
                            {/* Indicators */}
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="0" className="active"></button>
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="2"></button>
                            </div>

                            {/* Images */}
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carousel-image-wrap">
                                        <Image
                                            src="/image/property-img.webp"
                                            fill
                                            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 34vw, 300px"
                                            className="carousel-image"
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-image-wrap">
                                        <Image
                                            src="/image/property-img.webp"
                                            fill
                                            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 34vw, 300px"
                                            className="carousel-image"
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carousel-image-wrap">
                                        <Image
                                            src="/image/property-img.webp"
                                            fill
                                            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 34vw, 300px"
                                            className="carousel-image"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {/* TITLE + STARS */}
                    <div className="d-flex align-items-center mb-2">
                        <h4 className="property-grid-title font-size-18 my-auto me-3">Amora Hotel Jamison Sydney</h4>

                        <div className="text-warning">
                            <MdOutlineStarPurple500 size={18} color="#f0831e" />
                            <MdOutlineStarPurple500 size={18} color="#f0831e" />
                            <MdOutlineStarPurple500 size={18} color="#f0831e" />
                            <MdOutlineStarPurple500 size={18} color="#f0831e" />
                            <MdOutlineStarPurple500 size={18} color="#f0831e" />
                            {/* <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i> */}
                        </div>
                    </div>

                    {/* FACILITIES */}
                    <div className="d-flex align-items-center mb-2">
                        <p className="small-para-14-px font-weight-bold my-auto me-2">Facilities</p>

                        <div className="facility-icons d-flex me-2">
                            <Image src="/image/facility.webp"  fill className="m-auto" alt="" />
                        </div>

                        <div className="facility-icons d-flex me-2">
                            <Image src="/image/facility.webp"  fill className="m-auto" alt="" />
                        </div>

                        <div className="facility-icons d-flex me-2">
                            <Image src="/image/facility.webp"  fill className="m-auto" alt="" />
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <p className="small-para-14-px text-black mb-2">
                        <i className="fa-solid fa-map me-1"></i>
                        16 Hindley Street Adelaide 5000 Australia
                    </p>

                    {/* DISTANCE */}
                    <p className="small-para-14-px text-black mb-3">
                        <i className="fa-solid fa-plane-up me-1"></i>
                        8.78 km from Sydney SYD-Kingsford Smith Intl. airport
                    </p>

                    {/* DESCRIPTION */}
                    <p className="small-para-14-px text-black mb-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur velit eveniet unde ipsam ea dolorum reiciendis
                        veritatis sit illum illo, cumque, sint repudiandae sapiente error et eius vero quas deleniti!
                    </p>

                    {/* PAYMENT OPTION */}
                    <p className="para text-primary mb-1">
                        <i className="fa-solid fa-circle-info me-2"></i>
                        Book Now Pay Later!
                    </p>

                    <p className="para-12px mb-0 text-start text-theme-green">
                        <i className="fa-solid fa-check me-1"></i>
                        <b>Free Cancellation</b>
                    </p>

                    <p className="para-12px mb-3 text-start text-theme-green">
                        <i className="fa-solid fa-check me-1"></i>
                        No Payment Needed
                    </p>

                    {/* <p className="para-12px mb-0 text-start text-success">
                        <i className="fa-solid fa-check me-1"></i>
                        <b>Free Cancellation</b>
                    </p>

                    <p className="para-12px mb-3 text-start text-success">
                        <i className="fa-solid fa-check me-1"></i>
                        No Payment Needed
                    </p> */}
                    {/* RATING + BUTTON */}
                    <div className="row">
                        <div className="col-12 col-md-6 d-flex mb-3 mb-md-0">
                            <div className="my-auto d-flex">
                                <div className="rating-box d-flex me-2">
                                    <span className="m-auto">8.2</span>
                                </div>

                                <div className="my-auto">
                                    <p className="small-para-14-px font-weight-bold mb-1">Very good</p>

                                    <p className="para-12px mb-0">4,684 verified reviews</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 d-flex">
                            <a href="#" className="theme-button-blue rounded w-100 d-block text-center">
                                See Availability
                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
