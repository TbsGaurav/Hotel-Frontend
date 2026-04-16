'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
    console.error(error);

    return (
        <div
            className="container d-flex align-items-center justify-content-center py-5"
            style={{
                minHeight: '75vh',
                background: 'linear-gradient(180deg, rgba(240,131,30,0.08) 0%, rgba(255,255,255,0) 45%)'
            }}
        >
            <div
                className="w-100 rounded-4 bg-white position-relative overflow-hidden"
                style={{
                    maxWidth: '640px',
                    boxShadow: '0 18px 50px rgba(12, 25, 39, 0.12)',
                    border: '1px solid #edf1f5'
                }}
            >
                <div
                    className="position-absolute top-0 start-0 w-100"
                    style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, #f0831e 0%, #ffb14d 100%)'
                    }}
                />

                <div className="p-4 p-md-5 text-center">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                        style={{
                            width: '72px',
                            height: '72px',
                            background: 'rgba(240, 131, 30, 0.12)',
                            color: '#f0831e'
                        }}
                        aria-hidden="true"
                    >
                        <i className="fa-solid fa-triangle-exclamation fs-2" />
                    </div>

                    <p className="small-para-14-px text-uppercase fw-semibold mb-2" style={{ color: '#f0831e', letterSpacing: '0.12em' }}>
                        Error
                    </p>
                    <h1 className="fw-bold mb-3" style={{ color: '#0c1927' }}>
                        Something went wrong
                    </h1>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '480px' }}>
                        We couldn&apos;t load this page right now. Please try again, or head back to the homepage and continue browsing.
                    </p>

                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                        <button onClick={() => reset()} className="theme-button-orange rounded-2 px-4 py-2 border-0" type="button">
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="btn btn-outline-secondary rounded-2 px-4 py-2 d-inline-flex align-items-center justify-content-center"
                        >
                            Go Home
                        </Link>
                    </div>

                    <div className="mt-4 pt-3 border-top">
                        <p className="small-para-14-px text-muted mb-0">
                            If this keeps happening, refresh the page or come back in a moment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
