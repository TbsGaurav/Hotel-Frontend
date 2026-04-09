import React from 'react';

export default function Footer() {
    return (
        <footer>
            <section className="top-footer py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 d-flex justify-content-start justify-content-md-end mb-3 mb-md-0">
                            <h4 className="sub-heading-hero my-auto text-white">Subscribe to our newsletter</h4>
                        </div>
                        <div className="col-md-8">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-7 col-lg-7 mb-4 mb-md-0">
                                        <div className="my-auto">
                                            <div className="input-group custom-subscribe-textbox w-100">
                                                <span className="input-group-text bg-white" id="basic-addon1">
                                                    <i className="fa-solid fa-envelope"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="enteremamil"
                                                    placeholder="Enter Email"
                                                    aria-label="Enter Email"
                                                    aria-describedby="basic-addon1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-5 col-lg-4">
                                        <button
                                            type="submit"
                                            className="theme-button-orange rounded rounded rounded rounded w-100 min-height-50"
                                        >
                                            Subscribe
                                        </button>
                                    </div>
                                    <div className="col-lg-1 d-none d-lg-block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="second-footer pt-5 pb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-2 mx-auto mt-3">
                            <h5 className="mb-3 text-white footer-heading">About</h5>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Our Story
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Press Centre
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Partners & Fund Raising
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Terms & Conditions
                                </a>
                            </p>
                            <p className="small-para-14-px footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Privacy
                                </a>
                            </p>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2 mx-auto mt-3">
                            <h5 className="mb-3 text-white footer-heading">International Sites</h5>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Getaroom Australia
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Getaroom United Kingdom
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Getaroom India
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Getaroom Tonight.com
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Getaroom New Zealand
                                </a>
                            </p>
                            <p className="small-para-14-px footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    IWantThatFlight.com.au
                                </a>
                            </p>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2 mx-auto mt-3">
                            <h5 className="mb-3 text-white footer-heading">Menu</h5>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Top Travel Destinations
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Hotel Brands & Chains
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Hotel Travel Blog
                                </a>
                            </p>
                            <p className="small-para-14-px footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Rental Cars
                                </a>
                            </p>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2 mx-auto mt-3">
                            <h5 className="mb-3 text-white footer-heading">Customer Help</h5>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    My Reservations
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Help & FAQs
                                </a>
                            </p>
                            <p className="small-para-14-px pb-2 mb-2 footer-link-border-bottom footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Contact
                                </a>
                            </p>
                            <p className="small-para-14-px footer-links">
                                <a href="#" className="text-white" style={{ textDecoration: 'none' }}>
                                    Website Feedback
                                </a>
                            </p>

                            <div className="d-flex pt-3">
                                <a href="#" className="social-icons me-4">
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                                <a href="#" className="social-icons me-4">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-icons">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <section className="bottom-footer py-4">
                <div className="container">
                    <p className="sub-heading text-center text-white mb-2">100% verified reviews by booking.com</p>
                    <p className="copyright-text mb-0 text-center">© 2024. All rights reserved Hotels.com.au </p>
                </div>
            </section>
        </footer>
    );
}
