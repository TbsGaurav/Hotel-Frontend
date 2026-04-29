'use client';

import { useState } from 'react';
import AppLink from '@/components/common/AppLink';
import { getBrandList } from '@/lib/api/public/brandapi';

const ALPHABETS = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export default function BrandDropdown({ parentId, initialBrands }) {
    const [brands, setBrands] = useState(initialBrands || []);
    const [activeLetter, setActiveLetter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

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
                <h2 className="accordion-header" id="headingBrands">
                    <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-controls="collapseBrands"
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

                <div id="collapseBrands" className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`} aria-labelledby="headingBrands">
                    <div className="accordion-body accordion-main">
                        {/* Alphabet Filter */}
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

                        {/* Brand List */}
                        {loading ? (
                            <p>Loading brands...</p>
                        ) : brands.length === 0 ? (
                            <p className="text-muted">No brands available</p>
                        ) : (
                            <div className="row">
                                {brands.map((brand) => (
                                    <div key={brand.brandId} className="col-6 col-md-4 col-lg-3 country-list">
                                        {brand.urlName ? (
                                            <AppLink
                                                href={`/brand/${brand.urlName}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                {brand.name}
                                            </AppLink>
                                        ) : (
                                            <span className="text-dark fw-semibold">{brand.name}</span>
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


