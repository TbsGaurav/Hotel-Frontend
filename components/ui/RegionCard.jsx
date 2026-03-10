export default function RegionCard() {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
            <div className="row g-3">
                {/* HOTEL IMAGE */}
                <div className="col-md-4">
                    <div className="overflow-hidden rounded-4">
                        <img
                            src="/image/property-img.webp"
                            alt="hotel"
                            className="w-100"
                            style={{
                                height: '230px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>

                {/* HOTEL CONTENT */}
                <div className="col-md-8">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5 className="fw-semibold mb-1">Amora Hotel Jamison Sydney</h5>

                            <div className="text-warning mb-2">★★★★★</div>
                        </div>
                    </div>

                    <p className="text-muted small mb-2">📍 16 Hindley Street Adelaide 5000 Australia</p>

                    <p className="text-muted small mb-3">✈ 8.78 km from Sydney SYD-Kingsford Smith Intl. airport</p>

                    <p className="small text-muted">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    {/* FEATURES */}
                    <div className="mb-3">
                        <div className="text-primary small">Book Now Pay Later!</div>

                        <div className="text-success small">✓ Free Cancellation</div>

                        <div className="text-success small">✓ No Payment Needed</div>
                    </div>

                    {/* FOOTER */}
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="badge bg-primary p-2">8.2</span>

                            <span className="ms-2 fw-semibold">Very good</span>

                            <div className="small text-muted">4,684 verified reviews</div>
                        </div>

                        <button className="theme-orange-button px-4">See Availability →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
