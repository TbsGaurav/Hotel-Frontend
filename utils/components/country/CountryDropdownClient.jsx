'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function CountryDropdownClient() {
    const [open, setOpen] = useState(true);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/country/list`);
                setCountries(res.data.data);
            } catch (err) {
                console.error('Failed to load countries', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return (
        <div className="mb-4">
            {/* Header */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    background: '#f5f6f7',
                    padding: '14px 18px',
                    borderRadius: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '16px'
                }}
            >
                <span className="fs-4 fw-semibold">All Countries</span>
                <span>{open ? '▴' : '▾'}</span>
            </div>

            {/* Body */}
            {open && (
                <div
                    style={{
                        padding: '20px',
                        border: '1px solid #eee',
                        borderTop: 'none'
                    }}
                >
                    {loading ? (
                        <p>Loading countries...</p>
                    ) : (
                        <div className="row">
                            {countries.map((country) => (
                                <div key={country.countryID} className="col-6 col-md-4 col-lg-3 mb-2 ">
                                    <Link
                                        href={`/country/${country.urlName}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#000'
                                        }}
                                    >
                                        • {country.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
