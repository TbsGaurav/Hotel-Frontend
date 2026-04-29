'use client';
import LoginModal from '@/components/common/models/LoginModel';
import Image from 'next/image';
import AppLink from '@/components/common/AppLink';
import React, { useRef, useState, useEffect } from 'react';
import { currencies } from '@/lib/constants/currencies';
import { getUserCurrency } from '@/lib/getUserCurrency';

export default function Header() {
    const currencyDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [currency, setCurrency] = useState("AUD");
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuClosing, setIsMenuClosing] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function initHeader() {
            setIsMounted(true);

            // load bootstrap only on client
            import('bootstrap/dist/js/bootstrap.bundle.min.js');

            const cur = await getUserCurrency();

            if (!cancelled && cur) {
                setCurrency(cur);
            }
        }

        initHeader();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        document.body.classList.toggle('offcanvas-backdrop-active', isMenuOpen || isMenuClosing);

        return () => {
            document.body.classList.remove('offcanvas-backdrop-active');
        };
    }, [isMounted, isMenuOpen, isMenuClosing]);

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
        setIsMenuClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsMenuClosing(false);
        }, 300);
    };

    const changeCurrency = (cur) => {
        localStorage.setItem("currencyOverride", cur);
        localStorage.removeItem("currency");
        setCurrency(cur);
        setIsCurrencyOpen(false);
        window.dispatchEvent(new CustomEvent('currencychange', { detail: { currency: cur } }));
    };

    return (
        <>
            <LoginModal />
            <header className="py-2 py-md-4">
                <div className="container">
                    <div className="row">
                        <div className="col-6 col-md-3 d-flex justify-content-between justify-content-md-start">
                            <AppLink href="/" className="my-auto">
                                <Image
                                    src="/image/logo.webp"
                                    alt="Hotel.com.au Logo"
                                    width={160}
                                    height={40}
                                    priority
                                />
                            </AppLink>
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
                                    aria-controls="offcanvasExample"
                                    aria-expanded={isMenuOpen}
                                    onClick={() => setIsMenuOpen(true)}
                                >
                                    <i className="fa-light fa-bars me-2"></i> Menu
                                </button>
                                {isMounted && (
                                    <>
                                        <div
                                            className={`offcanvas-backdrop fade ${isMenuOpen && !isMenuClosing ? 'show' : ''}`}
                                            onClick={handleCloseOffcanvas}
                                            style={{ display: isMenuOpen || isMenuClosing ? 'block' : 'none' }}
                                        />
                                        <div
                                            className={`offcanvas offcanvas-end ${isMenuOpen ? 'show' : ''} ${isMenuClosing ? 'hiding' : ''}`}
                                            tabIndex="-1"
                                            id="offcanvasExample"
                                            aria-labelledby="offcanvasExampleLabel"
                                            aria-modal={isMenuOpen ? 'true' : undefined}
                                            role={isMenuOpen ? 'dialog' : undefined}
                                            style={{ visibility: isMenuOpen || isMenuClosing ? 'visible' : 'hidden' }}
                                        >
                                            <div className="offcanvas-header">
                                                <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                                                    Menu
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close text-reset"
                                                    aria-label="Close"
                                                    onClick={handleCloseOffcanvas}
                                                ></button>
                                            </div>
                                            <div className="offcanvas-body d-flex justify-content-between flex-column">
                                                <div>
                                                    <ul className="list-unstyled main-menu">
                                                        <li>
                                                            <AppLink href="/hotel-list" onClick={handleCloseOffcanvas}>
                                                                Find Hotel Deals
                                                            </AppLink>
                                                        </li>
                                                        <li>
                                                            <AppLink
                                                                href="/destinations"
                                                                className="d-flex align-items-center"
                                                                onClick={handleCloseOffcanvas}
                                                            >
                                                                Destinations
                                                            </AppLink>
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
                                                            <AppLink href="/" onClick={handleCloseOffcanvas}>
                                                                Home
                                                            </AppLink>
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
                                                            <AppLink href="/brands" onClick={handleCloseOffcanvas}>
                                                                All Brands
                                                            </AppLink>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
