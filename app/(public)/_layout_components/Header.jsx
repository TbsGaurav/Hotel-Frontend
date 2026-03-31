'use client';
import LoginModal from '@/components/common/models/LoginModel';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';
import { currencies } from '@/lib/constants/currencies';

export default function Header() {
    const offcanvasRef = useRef(null);
    const currencyDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const [currency, setCurrency] = useState("AUD");
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    useEffect(() => {

        // load bootstrap only on client
        import('bootstrap/dist/js/bootstrap.bundle.min.js');

        const cur = localStorage.getItem("currency");
        if (cur) setCurrency(cur);

    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
                setIsCurrencyOpen(false);
            }

            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCloseOffcanvas = () => {
        if (offcanvasRef.current && window.bootstrap) {
            const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current);

            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
    };

    const changeCurrency = (cur) => {
        localStorage.setItem("currency", cur);
        setCurrency(cur);
        setIsCurrencyOpen(false);
        window.location.reload();
    };

    return (
        <>
            <LoginModal />
            <header className="py-2 py-md-4">
                <div className="container">
                    <div className="row">
                        <div className="col-6 col-md-3 d-flex justify-content-between justify-content-md-start">
                            <Link href="/" className="my-auto">
                                <Image
                                    src="/image/logo.webp"
                                    alt="Hotel.com.au Logo"
                                    width={160}
                                    height={40}
                                    priority
                                />
                            </Link>
                        </div>
                        <div className="col-6 col-md-9 d-flex">
                            <div className="w-100 my-auto d-flex justify-content-end">
                                {/* Currency Dropdown */}
                                <div
                                    ref={currencyDropdownRef}
                                    className={`dropdown me-2 me-md-4 d-none d-lg-block ${isCurrencyOpen ? 'show' : ''}`}
                                >
                                    <button
                                        className="dropdown-toggle language-switcher"
                                        type="button"
                                        aria-expanded={isCurrencyOpen}
                                        onClick={() => {
                                            setIsCurrencyOpen((prev) => !prev);
                                            setIsLanguageOpen(false);
                                        }}
                                    >
                                        <span className="me-2 d-none d-md-inline-block">
                                            {currency}
                                        </span>
                                    </button>
                                    <ul className={`dropdown-menu language-switcher-menu-item ${isCurrencyOpen ? 'show' : ''}`}>
                                        {currencies.map((cur) => (
                                            <li key={cur}>
                                                <button
                                                    className={`dropdown-item ${currency === cur ? 'active' : ''}`}
                                                    onClick={() => changeCurrency(cur)}
                                                >
                                                    {cur}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Language dropdown */}
                                <div
                                    ref={languageDropdownRef}
                                    className={`dropdown d-none d-lg-block ${isLanguageOpen ? 'show' : ''}`}
                                >
                                    <button
                                        className="dropdown-toggle language-switcher"
                                        type="button"
                                        aria-expanded={isLanguageOpen}
                                        onClick={() => {
                                            setIsLanguageOpen((prev) => !prev);
                                            setIsCurrencyOpen(false);
                                        }}
                                    >
                                        <i className="fa-sharp fa-light fa-globe me-2"></i>
                                        <span className="me-2 d-none d-md-inline-block">
                                            English
                                        </span>
                                    </button>
                                    <ul className={`dropdown-menu language-switcher-menu-item ${isLanguageOpen ? 'show' : ''}`}>
                                        <li><button className="dropdown-item" type="button" onClick={() => setIsLanguageOpen(false)}>English</button></li>
                                        <li><button className="dropdown-item" type="button" onClick={() => setIsLanguageOpen(false)}>Hindi</button></li>
                                        <li><button className="dropdown-item" type="button" onClick={() => setIsLanguageOpen(false)}>Japanese</button></li>
                                    </ul>

                                </div>
                                <a
                                    href="#"
                                    className="theme-button-orange rounded mx-2 mx-md-4 d-none d-lg-block"
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
                                >
                                    <i className="fa-light fa-bars me-2"></i> Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
