'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginModal() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="modal fade " id="loginModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content border-0 rounded-4 p-4">
                    {/* Close Button */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">Login</h4>
                        <button type="button" className="custom-close-btn" data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Form */}
                    <form>
                        <div className="mb-1">
                            <label className="form-label small">Username/Email</label>
                            <input type="text" className="form-control login-register-form-textbox" />
                        </div>

                        <div className="mb-3 position-relative">
                            <label className="form-label small">Password</label>
                            <input type={showPassword ? 'text' : 'password'} className="form-control login-register-form-textbox pe-5" />

                            {/* Eye Icon */}
                            <span className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check small">
                                <input type="checkbox" className="form-check-input" id="remember" />
                                <label className="form-check-label small mb-0" htmlFor="remember">
                                    Keep me signed in
                                </label>
                            </div>

                            <Link href="/forgot-password" className="text-blue font-weight-400 small">
                                Forgot your password?
                            </Link>
                        </div>

                        <button type="submit" className="theme-button-orange w-100 mb-2 py-2 rounded-2">
                            Login
                        </button>

                        <button type="button" className="theme-button-blue w-100 mb-2 py-2 rounded-2 ">
                            Register Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
