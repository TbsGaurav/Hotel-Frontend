'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/public/assets/css/style.css';
import '@/public/assets/css/media.css';
import Script from 'next/script';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import Loader from './loading';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                <Suspense fallback={<Loader />}>
                    {children}
                    <Script src="/bootstrap.bundle.min.js" strategy="afterInteractive" />

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                fontSize: '15px'
                            }
                        }}
                    />
                </Suspense>
            </body>
        </html>
    );
}
