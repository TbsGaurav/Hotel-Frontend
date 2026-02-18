'use client';

import Link from 'next/link';

export default function AdminTopNav() {
    return (
        <nav className="navbar navbar-expand-lg  admin-navbar p-0">
            <div className="container-fluid p-0">
                <ul className="navbar-nav w-100">
                    {/* Dashboard */}
                    <li className="nav-item dropdown admin-hover">
                        <Link className="nav-link text-white px-4 py-3" href="/dashboard">
                            Dashboard
                        </Link>
                    </li>

                    {/* Content */}
                    <li className="nav-item dropdown admin-hover">
                        <a className="nav-link dropdown-toggle text-white px-4 py-3" href="#" role="button" data-bs-toggle="dropdown">
                            Content
                        </a>

                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" href="/collections">
                                    Collection
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Customer Booking Info
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Customers
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Special Url
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Hotel */}
                    <li className="nav-item dropdown admin-hover">
                        <a className="nav-link dropdown-toggle text-white px-4 py-3" href="#" role="button" data-bs-toggle="dropdown">
                            Hotel
                        </a>

                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Add Hotel
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Hotel List
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Logs */}
                    <li className="nav-item dropdown admin-hover">
                        <a className="nav-link dropdown-toggle text-white px-4 py-3" href="#" role="button" data-bs-toggle="dropdown">
                            Logs
                        </a>

                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Activity Logs
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Error Logs
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Settings */}
                    <li className="nav-item dropdown admin-hover">
                        <a className="nav-link dropdown-toggle text-white px-4 py-3" href="#" role="button" data-bs-toggle="dropdown">
                            Settings
                        </a>

                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" href="#">
                                    General
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    Roles
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
