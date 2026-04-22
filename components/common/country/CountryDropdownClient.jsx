'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CountryDropdownBootstrap({ countries }) {
    const [isOpen, setIsOpen] = useState(true); // default open like your current UI

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="accordion mb-4 accordion-top">
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingCountries">
                    <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-controls="collapseCountries"
                        style={{
                            background: '#f5f6f7',
                            borderRadius: '11px',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}
                    >
                        <span className="fs-4 fw-semibold">All Countries</span>
                    </button>
                </h2>

                <div
                    id="collapseCountries"
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby="headingCountries"
                >
                    <div className="accordion-body accordion-main">
                        <div className="row">
                            {countries.map((country, index) => (
                                <div
                                    key={country.countryId ?? country.urlName ?? index}
                                    className="col-6 col-md-4 col-lg-3 country-list"
                                >
                                    {country.urlName ? (
                                        <Link
                                            href={`/${country.urlName}`}
                                            className="text-decoration-none text-dark"
                                            prefetch={false}
                                        >
                                            {country.name}
                                        </Link>
                                    ) : (
                                        <span className="text-decoration-none text-dark">
                                            {country.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



// 'use client';

// import Link from 'next/link';

// export default function CountryDropdownBootstrap({ countries }) {
//     return (
//         <div className="accordion mb-4 accordion-top" id="countryAccordion">
//             <div className="accordion-item border-0">
//                 <h2 className="accordion-header" id="headingCountries">
//                     <button
//                         className="accordion-button"
//                         type="button"
//                         data-bs-toggle="collapse"
//                         data-bs-target="#collapseCountries"
//                         aria-expanded="true"
//                         aria-controls="collapseCountries"
//                         style={{
//                             background: '#f5f6f7',
//                             borderRadius: '11px',
//                             fontWeight: 600,
//                             fontSize: '16px'
//                         }}
//                     >
//                         <span className="fs-4 fw-semibold">All Countries</span>
//                     </button>
//                 </h2>

//                 <div
//                     id="collapseCountries"
//                     className="accordion-collapse collapse show"
//                     aria-labelledby="headingCountries"
//                     data-bs-parent="#countryAccordion"
//                 >
//                     <div className="accordion-body accordion-main"                    >
//                         <div className="row">
//                             {countries.map((country, index) => (
//                                 <div key={country.countryId ?? country.urlName ?? index}
//                                  className="col-6 col-md-4 col-lg-3 country-list">
//                                     {country.urlName ? (
//                                         <Link
//                                             href={`/${country.urlName}`}
//                                             className="text-decoration-none text-dark "
//                                             prefetch={false}
//                                         >
//                                              {country.name}
//                                         </Link>
//                                     ) : (
//                                         <span className="text-decoration-none text-dark ">
//                                              {country.name}
//                                         </span>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
