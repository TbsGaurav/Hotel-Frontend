import React from 'react';

function FindingBestHotelSection() {
    return (
        <section className="pt-5">
            <div className="container">
                <h2 className="heading text-center">Finding The Best Hotel Deals</h2>
                <h5 className="small-heading text-center">
                    When you make your hotel reservation at Hotel.com.au our FREE Price Guardian™ price intelligence service checks the
                    price of your booking each day until the end of the free cancellation period.
                </h5>
                <p className="para text-center mb-4">
                    If a cheaper price comes up you can simply re-book the cheaper rate or upgrade your room and cancel the original
                    booking.
                </p>
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <div className="my-auto">
                            <p className="small-para-14-px mb-4 mb-md-0 text-center text-md-start">{`Hotel prices fluctuate. Unfortunately finding a good price today doesn't mean there won't be a better price tomorrow! There could always be a sale starting tomorrow but how would you know unless you kept searching after you booked your hotel?<br><br>
                        Price Guardian is a price intelligence on your side, checking prices every day for you – now that’s a smart way to book.`}</p>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex">
                        <img src="image/about.webp" className="w-100 my-auto" alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FindingBestHotelSection;
