import React from 'react';

function WeekendGetawayHotelSection() {
    return (
        <section>
            <div className="container pt-5 pb-5 pb-md-0">
                <h2 className="heading text-center">
                    Weekend Getaway <span>Hotel Deals</span>
                </h2>
                <p className="small-para-14-px text-center px-0 px-md-5 mx-0 mx-lg-5 mb-3">
                    See the best hotel deals for this weekend and upcoming weekends across quality 4 and 5 star hotels in major capital
                    cities. We have done the research for you looking at prices over the next 52 weekends. <a href="#">read more</a>
                </p>

                <ul
                    className="nav nav-pills d-flex justify-content-center flex-nowrap flex-row tabs-layout property-grid-tabs"
                    id="wghoteldeals"
                    role="tablist"
                >
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link active"
                            id="home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Adelaide"
                            type="button"
                            role="tab"
                            aria-controls="Adelaide"
                            aria-selected="true"
                        >
                            Adelaide
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Brisbane"
                            type="button"
                            role="tab"
                            aria-controls="Brisbane"
                            aria-selected="false"
                        >
                            Brisbane
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Canberra"
                            type="button"
                            role="tab"
                            aria-controls="Canberra"
                            aria-selected="false"
                        >
                            Canberra
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#GoldCoast"
                            type="button"
                            role="tab"
                            aria-controls="GoldCoast"
                            aria-selected="false"
                        >
                            Gold Coast
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Hobart"
                            type="button"
                            role="tab"
                            aria-controls="Hobart"
                            aria-selected="false"
                        >
                            Hobart
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Perth"
                            type="button"
                            role="tab"
                            aria-controls="Perth"
                            aria-selected="false"
                        >
                            Perth
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Melbourne"
                            type="button"
                            role="tab"
                            aria-controls="Melbourne"
                            aria-selected="false"
                        >
                            Melbourne
                        </button>
                    </li>
                    <li className="nav-item mx-0 mx-lg-3" role="presentation">
                        <button
                            className="nav-link"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#Sydney"
                            type="button"
                            role="tab"
                            aria-controls="Sydney"
                            aria-selected="false"
                        >
                            Sydney
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="wghoteldealsContent">
                    <div className="tab-pane fade show active" id="Adelaide" role="tabpanel" aria-labelledby="home-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="AdelaideOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Brisbane" role="tabpanel" aria-labelledby="profile-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="BrisbaneOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Canberra" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="CanberraOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="GoldCoast" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="GoldCoastOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Hobart" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="HobartOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Perth" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="PerthOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Melbourne" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="MelbourneOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="Sydney" role="tabpanel" aria-labelledby="contact-tab">
                        <div className="pt-3">
                            <div className="owl-carousel owl-theme" id="SydneyOwl">
                                <div className="item p-3">
                                    <div className="property-grid-box p-2">
                                        <div id="AdelaideInnerImage" className="carousel slide mb-3" data-bs-ride="carousel">
                                            <ol className="carousel-indicators">
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="0" className="active"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="1"></li>
                                                <li data-bs-target="#AdelaideInnerImage" data-bs-slide-to="2"></li>
                                            </ol>
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="image/property-img.webp" className="d-block w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="d-flex mb-2">
                                                <h4 className="property-grid-title my-auto me-3">Miller Apartments</h4>
                                                <div className="rating my-auto">
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                    <i className="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            <p className="small-para-14-px text-black mb-3">16 Hindley Street Adelaide 5000 Australia</p>
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <p className="mb-1 small-para-14-px text-decoration-line-through text-black">
                                                        AUD $673
                                                    </p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="para text-theme-green my-auto">AUD $354</p>
                                                </div>
                                                <div className="col-6 d-flex">
                                                    <p className="small-para-14-px my-auto ms-auto">1 night, 2 adults</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <a href="#" className="theme-button-blue rounded rounded rounded rounded mb-4 w-100">
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WeekendGetawayHotelSection;
