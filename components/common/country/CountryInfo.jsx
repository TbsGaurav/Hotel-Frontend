import Link from 'next/link';

export default function CountryIntro({ countryName, descriptionHtml }) {
    return (
        <>
            <div className="py-2 accordion-main">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link href={`/${countryName}`} className="fw-semibold text-decoration-none">
                            {countryName}
                        </Link>
                    </div>
                </div>
            </div>
            <section className="container py-3">
                <div className="row align-items-center">
                    {/* LEFT CONTENT */}
                    <div className="col-md-7 ">
                        <h2 className="heading mb-3 accordion-main">Hotel Accommodation in {countryName}</h2>
                        <div
                            className="text-muted country-description"
                            dangerouslySetInnerHTML={{
                                __html: descriptionHtml || ''
                            }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
