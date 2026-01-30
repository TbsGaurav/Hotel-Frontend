import React from 'react';
import Header from './_layout_components/Header';
import Footer from './_layout_components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
}
