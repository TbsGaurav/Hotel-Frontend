import Link from 'next/link';

export default function CountryIntro({ countryName, descriptionHtml }) {
    return (
        <section className="container py-5">
            <p className="text-muted mb-2">
                <Link href="/destinations" className="text-muted text-decoration-none">
                    All Countries
                </Link>
                {' · '}
                <Link href={`/${countryName}`} className="fw-semibold text-decoration-none">
                    {countryName}
                </Link>
            </p>

            <div className="row align-items-center">
                {/* LEFT CONTENT */}
                <div className="col-md-7">
                    <h2 className="heading mb-3">Hotel Accommodation in {countryName}</h2>
                    <div
                        className="text-muted country-description"
                        dangerouslySetInnerHTML={{
                            __html: descriptionHtml || ''
                        }}
                    />
                </div>

                {/* RIGHT IMAGE */}
                {/* <div className="col-md-5 text-center">
                    <img src={heroImage} alt={countryName} className="img-fluid rounded" style={{ maxHeight: 280 }} />
                </div> */}
            </div>
        </section>
    );
}
