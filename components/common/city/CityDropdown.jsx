'use client';

import { useState } from 'react';
import Link from 'next/link';

const ALPHABETS = ['Top Cities', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export default function CityDropdown({ countryName, initialCities, parentId }) {
    const [cities, setCities] = useState(initialCities||[]);
    const [activeLetter, setActiveLetter] = useState('Top Cities');
    const [loading, setLoading] = useState(false);

    const fetchCitiesByAlphabet = async (letter) => {
        setActiveLetter(letter);
        setLoading(true);

        const url =
            letter === 'Top Cities'
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/country/getByUrl/${countryName}`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/country/getByUrl/${countryName}?alphabet=${letter.toLowerCase()}`;

        const res = await fetch(url, { cache: 'no-store' });
        const json = await res.json();

        const cityData = json.data.countryData.filter((item) => item.type === 'City');

        setCities(cityData);
        setLoading(false);
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingCities">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseCities"
                    aria-expanded="false"
                    aria-controls="collapseCities"
                >
                    All cities in {countryName}
                </button>
            </h2>

            <div id="collapseCities" className="accordion-collapse collapse" data-bs-parent={`#${parentId}`}>
                <div className="accordion-body">
                    {/* Alphabet Buttons */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
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

                    {/* City List */}
                    {loading ? (
                        <p>Loading cities…</p>
                    ) : (
                        <div className="row">
                            {cities.map((city) => (
                                <div key={city.id} className="col-6 col-md-3 mb-2 fw-semibold">
                                    {city.urlName ? (
                                        <Link href={`/city/${city.urlName}`} className="text-decoration-none text-dark">
                                            • {city.itemName}
                                        </Link>
                                    ) : (
                                        <>• {city.itemName}</>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
