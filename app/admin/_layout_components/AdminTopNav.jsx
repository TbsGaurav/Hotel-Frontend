'use client';

import { ADMIN_ROUTES } from '@/lib/route';
import Link from 'next/link';

export default function AdminTopNav() {
    return (
        <nav className="navbar navbar-expand-lg admin-navbar p-0">
            <div className="container-fluid">
                {/* Hamburger Button */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Menu */}
                <div className="collapse navbar-collapse" id="adminNavbar">
                    <ul className="navbar-nav w-100">
                        <li className="nav-item">
                            <Link className="nav-link text-white px-4 py-3" href={ADMIN_ROUTES.dashboard}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white px-4 py-3" href={ADMIN_ROUTES.collections}>
                                Collection
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white px-4 py-3" href="#">
                                Hotel
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white px-4 py-3" href="#">
                                Logs
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white px-4 py-3" href="#">
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
