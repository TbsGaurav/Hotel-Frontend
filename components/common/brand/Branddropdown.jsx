'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getBrandList } from '@/lib/api/public/brandapi';

const ALPHABETS = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export default function BrandDropdown({ parentId, initialBrands }) {
    const [brands, setBrands] = useState(initialBrands || []);
    const [activeLetter, setActiveLetter] = useState('All');
    const [loading, setLoading] = useState(false);

    const fetchBrands = async (letter) => {
        try {
            setActiveLetter(letter);
            setLoading(true);
            const data = letter === 'All' ? await getBrandList() : await getBrandList(letter);
            setBrands(data);
        } catch (error) {
            console.error(error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="accordion mb-4 accordion-top" id={parentId}>
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingCities">
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseCities"
                        aria-expanded="false"
                        aria-controls="collapseCities"
                        style={{
                            background: '#f5f6f7',
                            borderRadius: '11px',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}
                    >
                        <span className="fs-5 fw-semibold">Brands</span>
                    </button>
                </h2>

                <div
                    id="collapseCities"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingCities"
                    data-bs-parent={`#${parentId}`}
                >
                    <div
                        className="accordion-body accordion-main">
                        <div className="d-flex flex-wrap gap-2 mb-4 mt-2">
                            {ALPHABETS.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => fetchBrands(letter)}
                                    className={`btn btn-sm ${activeLetter === letter ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p>Loading brands...</p>
                        ) : (
                            <div className="row">
                                {brands.map((brand) => (
                                    <div key={brand.brandId} className="col-6 col-md-4 col-lg-3 country-list"> 
                                        {brand.urlName ? (
                                            <Link href={`/brand/${brand.urlName}`} className="text-decoration-none text-dark ">
                                                 {brand.name}
                                            </Link>
                                        ) : (
                                            <span className="text-dark fw-semibold"> {brand.name}</span>
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
