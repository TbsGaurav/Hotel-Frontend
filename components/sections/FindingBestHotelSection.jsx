

import Image from 'next/image';
import React from 'react';

function FindingBestHotelSection() {
    return (
        <section className="finding-best-section pt-5">
            <div className="container">
                <h2 className="heading text-center">Finding The Best Hotel Deals</h2>
                <h5 className="small-heading text-center">
                    When you make your hotel reservation at Hotel.com.au our FREE Price Guardian™ price intelligence service checks the
                    price of your booking each day until the end of the free cancellation period.
                </h5>
                <p className="para text-center mb-0">
                    If a cheaper price comes up you can simply re-book the cheaper rate or upgrade your room and cancel the original
                    booking.
                </p>
                <div className="row finding-best-row mt-4">
                    <div className="col-md-6 d-flex">
                        <div>
                            <p className="small-para-14-px mb-3 mb-md-0 text-center text-md-start">{`Hotel prices fluctuate. Unfortunately finding a good price today doesn't mean there won't be a better price tomorrow! There could always be a sale starting tomorrow but how would you know unless you kept searching after you booked your hotel?
                        Price Guardian is a price intelligence on your side, checking prices every day for you – now that’s a smart way to book.`}</p>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex">
                        <div className="image-wrapper">
                            <Image
                                src="/image/about.webp"
                                alt="About"
                                fill
                                sizes="(max-width: 767px) 100vw, 50vw"
                                className="custom-img"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FindingBestHotelSection;
