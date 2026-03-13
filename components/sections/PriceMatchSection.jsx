export default function PriceMatchSection() {
    const logos = [
        '/image/logos/accor.png',
        '/image/logos/breakfree.png',
        '/image/logos/comfort.png',
        '/image/logos/fourpoints.png',
        '/image/logos/hilton.png',
        '/image/logos/mantra.png',
        '/image/logos/marriott.png',
        '/image/logos/mercure.png',
        '/image/logos/shangrila.png',
        '/image/logos/sheraton.png',
        '/image/logos/sofitel.png',
        '/image/logos/westin.png',
        '/image/logos/quality.png',
        '/image/logos/pullman.png',
        '/image/logos/novotel.png'
    ];

    return (
        <section className="py-5">
            <div className="container">
                <hr className="my-3 opacity-25" />

                <div className="text-center pt-4">
                    <h2 className="fw-bold mb-3">We Price Match (And its easy)</h2>

                    <p className="text-muted mx-auto mb-5" style={{ maxWidth: '700px' }}>
                        If you find a cheaper price after booking look for
                        <strong> "Found this room cheaper elsewhere?" </strong>
                        on your confirmation page to request a price match and see price match terms.
                    </p>
                </div>

                {/* <div className="row justify-content-center align-items-center g-4">
                    {logos.map((logo, index) => (
                        <div key={index} className="col-4 col-md-3 col-lg-2">
                            <img src={logo} className="img-fluid" style={{ maxHeight: '55px', objectFit: 'contain' }} alt="hotel brand" />
                        </div>
                    ))}
                </div> */}
            </div>
        </section>
    );
}
