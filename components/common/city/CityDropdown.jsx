'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fetchClient } from '@/lib/api/public/fetchClient';

const ALPHABETS = ['Top Cities', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const DROPDOWN_TOGGLE_EVENT = 'shared-dropdown-toggle';

export default function CityDropdown({ countryName, initialCities = [], parentId }) {
    const [cities, setCities] = useState(initialCities);
    const [activeLetter, setActiveLetter] = useState('Top Cities');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const instanceIdRef = useRef(`city-dropdown-${Math.random().toString(36).slice(2, 10)}`);

    const ITEM_TYPE = {
        City: 0,
        Region: 1,
        HotelBrand: 2,
        HotelType: 3
    };

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!isOpen) return;

        window.dispatchEvent(
            new CustomEvent(DROPDOWN_TOGGLE_EVENT, {
                detail: {
                    parentId,
                    activeId: instanceIdRef.current
                }
            })
        );
    }, [isOpen, parentId]);

    useEffect(() => {
        const handleSharedToggle = (event) => {
            const detail = event?.detail || {};

            if (!detail.parentId || detail.parentId !== parentId) return;
            if (detail.activeId === instanceIdRef.current) return;

            setIsOpen(false);
        };

        window.addEventListener(DROPDOWN_TOGGLE_EVENT, handleSharedToggle);

        return () => {
            window.removeEventListener(DROPDOWN_TOGGLE_EVENT, handleSharedToggle);
        };
    }, [parentId]);

    const fetchCitiesByAlphabet = async (letter) => {
        try {
            setActiveLetter(letter);
            setLoading(true);

            const endpoint =
                letter === 'Top Cities'
                    ? `/countries/${countryName}`
                    : `/countries/${countryName}?alphabet=${letter.toLowerCase()}`;

            const json = await fetchClient(endpoint);

            const cityData =
                json?.data?.countryData?.filter((item) => Number(item.type) === ITEM_TYPE.City) || [];

            setCities(cityData);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            setCities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="accordion mb-4 accordion-top" id={parentId}>
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingCities">
                    <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-controls="collapseCities"
                        style={{
                            background: '#f5f6f7',
                            borderRadius: '11px',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}
                    >
                        <span className="fs-5 fw-semibold">All Cities in {countryName}</span>
                    </button>
                </h2>

                <div
                    id="collapseCities"
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby="headingCities"
                >
                    <div className="accordion-body accordion-main">
                        <div className="d-flex flex-wrap gap-2 mb-4 mt-2">
                            {ALPHABETS.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => fetchCitiesByAlphabet(letter)}
                                    className={`btn btn-sm ${activeLetter === letter ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p className="mb-0">Loading cities...</p>
                        ) : (
                            <div className="row">
                                {cities.map((city) => (
                                    <div key={city.id} className="col-6 col-md-4 col-lg-3 country-list">
                                        {city.urlName ? (
                                            <Link
                                                href={`${city.urlName}`}
                                                className="text-decoration-none text-dark"
                                                prefetch={false}
                                            >
                                                {city.itemName}
                                            </Link>
                                        ) : (
                                            <span className="text-dark">{city.itemName}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
