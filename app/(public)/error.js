'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
    console.error(error);

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div
                className="text-center p-4 rounded-4"
                style={{
                    maxWidth: '500px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: '#fff'
                }}
            >
                <h2 className="fw-bold mb-3">Oops! Something went wrong 😔</h2>

                <p className="text-muted mb-4">
                    We couldn’t load this page. Please try again.
                </p>

                <div className="d-flex gap-3 justify-content-center">
                    <button onClick={() => reset()} className="btn btn-primary">
                        Try Again
                    </button>

                    <Link href="/" className="btn btn-outline-secondary">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}