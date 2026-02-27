'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/public/assets/css/style.css';
import '@/public/assets/css/media.css';
import Script from 'next/script';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Toaster } from 'react-hot-toast';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
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
            </body>
        </html>
    );
}
