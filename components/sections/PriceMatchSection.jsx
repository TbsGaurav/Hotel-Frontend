import Image from 'next/image';

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
    const desktopRows = [logos.slice(0, 8), logos.slice(8)];
    const mobileRows = [logos.slice(0, 4), logos.slice(4, 8), logos.slice(8, 12), logos.slice(12)];

    return (
        <section className="py-5 price-match-section">
            <div className="container">
                <hr className="my-3 opacity-25" />

                <div className="text-center pt-4">
                    <h2 className="fw-bold mb-3">We Price Match (And its easy)</h2>

                    <p className="text-muted mx-auto mb-5 price-match-intro">
                        If you find a cheaper price after booking look for
                        <strong> &quot;Found this room cheaper elsewhere?&quot; </strong>
                        on your confirmation page to request a price match and see price match terms.
                    </p>
                </div>

                <div className="container mt-4 d-none d-md-block">
                    {desktopRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="row justify-content-center align-items-center g-4 mb-4">
                            {row.map((logo, logoIndex) => (
                                <div key={`${rowIndex}-${logoIndex}`} className="col-6 col-md-3 col-lg text-center">
                                    <a href={logo.url} className="brand-logo-wrap">
                                        <Image
                                            src={logo.img}
                                            alt="brand logo"
                                            fill
                                            sizes="(max-width: 767px) 0px, (max-width: 991px) 25vw, 12vw"
                                            className="brand-logo"
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="price-match-logos mt-4 d-md-none">
                    {mobileRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="price-match-logos-row">
                            {row.map((logo, logoIndex) => (
                                <div key={`${rowIndex}-${logoIndex}`} className="price-match-logo-cell">
                                    <a href={logo.url} className="price-match-logo-wrap">
                                        <Image
                                            src={logo.img}
                                            alt="brand logo"
                                            fill
                                            sizes="(max-width: 575px) 106px, 110px"
                                            className="price-match-logo"
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <hr className="border-secondary opacity-10 my-5" />
            </div>
        </section>
    );
}
