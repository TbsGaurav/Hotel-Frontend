export default function WhyHotelSection() {
    const benefits = [
        'Free cancellation on most rooms',
        'Over 2 million hotels, resorts, apartments',
        'Book now, lock in price',
        'Flexibility to change plans',
        'Book multiple hotels, decide later',
        'Best price guarantee available'
    ];

    return (
        <section className="why-book-section py-5">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-7 main-div">
                        <h2 className="heading mb-4">
                            Why book with <span className="text-warning">hotel.com.au</span>
                        </h2>

                        <ul className="row list-unstyled mb-3 mb-md-0">
                            {benefits.map((item, i) => (
                                <li key={i} className="col-12 col-md-6 mb-3">
                                    <p className="small-heading-19-px text-black mb-0 d-flex align-items-center">
                                        <i className="fa-solid fa-circle-check text-success me-2"></i>
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Image */}
                    <div className="col-lg-5 text-center">
                        <img
                            src="/image/property-img.webp"
                            className="img-fluid rounded-4"
                            style={{
                                maxHeight: '260px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
