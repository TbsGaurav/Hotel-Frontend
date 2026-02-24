'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminLoginApi } from '@/lib/api/admin/authapi';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await adminLoginApi(username, password);
            const token = response.token;
            const roleName = response.user.roleName;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminRole', roleName);

            if (roleName === 'User') {
                router.replace('/');
            } else if (['Admin', 'Editor', 'Viewer'].includes(roleName)) {
                router.replace('/dashboard');
            } else {
                router.replace('/auth/login');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#ffffff'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    {/* Smaller width */}
                    <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                        {/* <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6"> */}
                        <div className="card shadow border-0 rounded-4 p-4">
                            {/* Logo */}
                            <div className="text-center mb-3">
                                <Image src="/image/logo.webp" alt="Logo" width={140} height={35} priority />
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-3">
                                <h5 className="fw-semibold mb-1">Welcome Back</h5>
                                <p className="text-muted small mb-0">Sign in to your account</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Username</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Remember */}
                                <div className="d-flex justify-content-between align-items-center mb-3 small">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="remember" />
                                        <label className="form-check-label" htmlFor="remember">
                                            Remember me
                                        </label>
                                    </div>

                                    <Link href="/forgot-password" className="text-decoration-none text-primary">
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Button */}
                                <button type="submit" className="btn w-100 fw-semibold rounded-3 text-white theme-button-orange py-2">
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
