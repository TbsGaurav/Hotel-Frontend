'use client';
import LoginModal from '@/components/common/models/LoginModel';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';

export default function Header() {
    const offcanvasRef = useRef(null);

    const handleCloseOffcanvas = () => {
        if (offcanvasRef.current) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasRef.current);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
    };

    return (
        <>
            <LoginModal />
            <header className="py-2 py-md-4">
                <div className="container">
                    <div className="row">
                        <div className="col-6 col-md-3 d-flex justify-content-between justify-content-md-start">
                            <Link href="/" className="my-auto">
                                <Image src="/image/logo.webp" alt="Hotel.com.au Logo" width={160} height={40} priority />
                            </Link>
                        </div>
                        <div className="col-6 col-md-9 d-flex">
                            <div className="w-100 my-auto d-flex justify-content-end justify-content-md-end">
                                <div className="dropdown me-2 me-md-4 d-none d-lg-block">
                                    <button
                                        className="dropdown-toggle language-switcher"
                                        type="button"
                                        id="languageSwitcher"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="me-2 d-none d-md-inline-block">AUD</span>
                                    </button>
                                    <ul className="dropdown-menu language-switcher-menu-item" aria-labelledby="languageSwitcher">
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                AUD
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                USD
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                INR
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="dropdown d-none d-lg-block">
                                    <button
                                        className="dropdown-toggle language-switcher"
                                        type="button"
                                        id="languageSwitcher"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="fa-sharp fa-light fa-globe me-2"></i>{' '}
                                        <span className="me-2 d-none d-md-inline-block">English</span>
                                    </button>
                                    <ul className="dropdown-menu language-switcher-menu-item" aria-labelledby="languageSwitcher">
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                English
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Hindi
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Japanese
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <a
                                    href="#"
                                    className="theme-button-orange rounded rounded rounded rounded mx-2 mx-md-4 d-none d-lg-block"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                >
                                    Sign In / Sign Up
                                </a>

                                <button
                                    className="theme-bordered-button rounded"
                                    type="button"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasExample"
                                    aria-controls="offcanvasExample"
                                >
                                    <i className="fa-light fa-bars me-2"></i> Menu
                                </button>
                                <div
                                    className="offcanvas offcanvas-end"
                                    tabIndex="-1"
                                    id="offcanvasExample"
                                    aria-labelledby="offcanvasExampleLabel"
                                    ref={offcanvasRef}
                                >
                                    <div className="offcanvas-header">
                                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                                            Menu
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close text-reset"
                                            data-bs-dismiss="offcanvas"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="offcanvas-body d-flex justify-content-between flex-column">
                                        <div>
                                            <ul className="list-unstyled main-menu">
                                                <li>
                                                    <Link href="/hotel-list" onClick={handleCloseOffcanvas}>
                                                        Find Hotel Deals
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        href="/destinations"
                                                        className="d-flex align-items-center"
                                                        onClick={handleCloseOffcanvas}
                                                    >
                                                        Destinations
                                                    </Link>
                                                </li>

                                                <li>
                                                    <a href="#" onClick={handleCloseOffcanvas}>
                                                        Help
                                                    </a>
                                                </li>

                                                <li>
                                                    <a href="#" onClick={handleCloseOffcanvas}>
                                                        My Hotel
                                                    </a>
                                                </li>

                                                <li>
                                                    <Link href="/" onClick={handleCloseOffcanvas}>
                                                        Home
                                                    </Link>
                                                </li>

                                                <li>
                                                    <a href="#" onClick={handleCloseOffcanvas}>
                                                        Popular Destinations
                                                    </a>
                                                </li>

                                                <li>
                                                    <a href="#" onClick={handleCloseOffcanvas}>
                                                        Blogs
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/brands" onClick={handleCloseOffcanvas}>
                                                        All Brands
                                                    </a>
                                                </li>
                                            </ul>

                                            {/* <ul className="list-unstyled main-menu">
                                            <li>
                                                <a href="hotel-list.html">Find Hotel Deals</a>
                                            </li>
                                            <li>
                                                <a href="#">Help</a>
                                            </li>
                                            <li>
                                                <a href="#">My Hotel</a>
                                            </li>
                                            <li>
                                                <a href="index.html">Home</a>
                                            </li>
                                            <li>
                                                <a href="#">Popular Destinations</a>
                                            </li>
                                            <li>
                                                <a href="#">Blogs</a>
                                            </li>
                                        </ul> */}
                                        </div>

                                        {/* <div>
                                        <div className="d-flex mt-5">
                                            <div className="dropdown me-2 mx-lg-4 d-block d-lg-none w-50">
                                                <button
                                                    className="dropdown-toggle language-switcher w-100 d-flex justify-content-between align-items-center"
                                                    type="button"
                                                    id="languageSwitcher"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <span>AUD</span>
                                                </button>
                                                <ul
                                                    className="dropdown-menu language-switcher-menu-item"
                                                    aria-labelledby="languageSwitcher"
                                                >
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            AUD
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            USD
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            INR
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="dropdown d-block d-lg-none w-50">
                                                <button
                                                    className="dropdown-toggle language-switcher w-100 d-flex justify-content-between align-items-center"
                                                    type="button"
                                                    id="languageSwitcher"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="fa-sharp fa-light fa-globe me-2"></i>{' '}
                                                    <span className="me-2 d-inline-block">English</span>
                                                </button>
                                                <ul
                                                    className="dropdown-menu language-switcher-menu-item"
                                                    aria-labelledby="languageSwitcher"
                                                >
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            English
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            Hindi
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            Japanese
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <a
                                            href="#"
                                            className="theme-button-orange rounded rounded rounded rounded w-100 mt-3 text-center d-block d-lg-none"
                                            data-bs-toggle="modal"
                                            data-bs-target="#loginMadal"
                                        >
                                            Sign In / Sign Up
                                        </a>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
