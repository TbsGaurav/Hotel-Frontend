export default function PriceMatchSection() {
    const logos = [
        { img: '/image/clients/AccorLogo80x80.jpg', url: '/brand/accor-hotels' },
        { img: '/image/clients/BreakFree80x80.jpg', url: '/brand/breakfree' },
        { img: '/image/clients/ComfortInn80x80.jpg', url: '/brand/comfort-inn' },
        { img: '/image/clients/FourPoints80x80.jpg', url: '/brand/four-points' },
        { img: '/image/clients/Hilton.jpg', url: '/brand/hilton-hotels' },
        { img: '/image/clients/Mantra_Logo.jpg', url: '/brand/mantra' },
        { img: '/image/clients/marriotLogo80x80.jpg', url: '/brand/marriott-hotels-and-resorts' },
        { img: '/image/clients/logo_MERCURE_Accor_hotels80x80.jpg', url: '/brand/mercure' },
        { img: '/image/clients/ShangriLa80x80.jpg', url: '/brand/shangri-la-hotels-and-resorts' },
        { img: '/image/clients/Sheraton80x80.jpg', url: '/brand/sheraton-hotel' },
        { img: '/image/clients/sofitel80x80.jpg', url: '/brand/sofitel' },
        { img: '/image/clients/WestinLogo80x80.jpg', url: '/brand/westin' },
        { img: '/image/clients/Quality-Hotel-Logo.jpg', url: '/brand/quality' },
        { img: '/image/clients/Pullman-hotels-and-resorts.jpg', url: '/brand/pullman-hotels-and-resorts' },
        { img: '/image/clients/novotel-logo.png', url: '/brand/novotel' }
    ];

    return (
        <section className="py-5">
            <div className="container">
                <hr className="my-3 opacity-25" />

                <div className="text-center pt-4">
                    <h2 className="fw-bold mb-3">We Price Match (And its easy)</h2>

                    <p className="text-muted mx-auto mb-5" style={{ maxWidth: '700px' }}>
                        If you find a cheaper price after booking look for
                        <strong> &quot;Found this room cheaper elsewhere?&quot; </strong>
                        on your confirmation page to request a price match and see price match terms.
                    </p>
                </div>

                <div className="container mt-4">
                    {/* First row */}
                    <div className="row justify-content-center align-items-center g-4 mb-4">
                        {logos.slice(0, 8).map((logo, index) => (
                            <div key={index} className="col-6 col-md-3 col-lg text-center">
                                <a href={logo.url}>
                                    <img
                                        src={logo.img}
                                        alt="brand logo"
                                        className="img-fluid"
                                        style={{ minHeight: '130px', objectFit: 'contain' }}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Second row */}
                    <div className="row justify-content-center align-items-center g-4">
                        {logos.slice(8).map((logo, index) => (
                            <div key={index} className="col-6 col-md-3 col-lg text-center">
                                <a href={logo.url}>
                                    <img
                                        src={logo.img}
                                        alt="brand logo"
                                        className="img-fluid"
                                        style={{ minHeight: '130px', objectFit: 'contain' }}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-secondary opacity-10 my-5" />
            </div>
        </section>
    );
}
