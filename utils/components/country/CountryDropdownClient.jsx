// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// export default function CountryDropdownClient({ countries }) {
//     const [open, setOpen] = useState(true);

//     return (
//         <div className="mb-4">
//             {/* Header */}
//             <button
//                 onClick={() => setOpen(!open)}
//                 aria-expanded={open}
//                 aria-controls="country-dropdown-body"
//                 style={{
//                     background: '#f5f6f7',
//                     padding: '14px 18px',
//                     borderRadius: '11px',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     fontWeight: 600,
//                     fontSize: '16px',
//                     border: 'none',
//                     width: '100%',
//                     textAlign: 'left'
//                 }}
//             >
//                 <span className="fs-4 fw-semibold">All Countries</span>
//                 <span>{open ? '▴' : '▾'}</span>
//             </button>

//             {/* Body */}
//             {open && (
//                 <div
//                     style={{
//                         padding: '20px',
//                         border: '1px solid #eee',
//                         borderTop: 'none'
//                     }}
//                 >
//                     <div className="row">
//                         {countries.map((country) => (
//                             <div key={country.countryID} className="col-6 col-md-4 col-lg-3 mb-2 ">
//                                 <Link
//                                     href={{
//                                         pathname: `/country/${country.urlName}`
//                                     }}
//                                     style={{
//                                         textDecoration: 'none',
//                                         color: '#000'
//                                     }}
//                                 >
//                                     • {country.name}
//                                 </Link>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

'use client';

import Link from 'next/link';

export default function CountryDropdownBootstrap({ countries }) {
    return (
        <div className="accordion mb-4" id="countryAccordion">
            <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingCountries">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseCountries"
                        aria-expanded="true"
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
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingCountries"
                    data-bs-parent="#countryAccordion"
                >
                    <div
                        className="accordion-body"
                        style={{
                            padding: '20px',
                            border: '1px solid #eee',
                            borderTop: 'none'
                        }}
                    >
                        <div className="row">
                            {countries.map((country) => (
                                <div key={country.countryID} className="col-6 col-md-4 col-lg-3 mb-2">
                                    <Link href={`/${country.urlName}`} className="text-decoration-none text-dark fw-semibold">
                                        • {country.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
