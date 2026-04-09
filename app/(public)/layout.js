import Header from './_layout_components/Header';
import Footer from './_layout_components/Footer';

export const metadata = {
    robots: {
        index: false,
        follow: false
    }
};

export default function UserLayout({ children }) {


    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">{children}</main>
            <Footer />
        </div>
    );
}
