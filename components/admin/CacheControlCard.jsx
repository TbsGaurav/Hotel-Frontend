'use client';

import { clearCacheApi } from '@/lib/api/admin/cacheapi';
import { useEffect, useState } from 'react';

export default function CacheControlCard() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem('adminRole') === 'Admin');
    }, []);

    if (!isAdmin) {
        return null;
    }

    const handleClearCache = async () => {
        const token = localStorage.getItem('adminToken');

        if (!token) {
            setMessage('Admin token is missing. Please log in again.');
            setMessageType('danger');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await clearCacheApi(token);
            setMessage(result?.message || 'Cache cleared successfully.');
            setMessageType('success');
        } catch (error) {
            setMessage(error.message || 'Unable to clear cache.');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h5 className="card-title mb-1">Cache Management</h5>
                        <p className="text-muted mb-0">
                            Clears the API cache on this server by invalidating cached generations.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-warning fw-semibold"
                        onClick={handleClearCache}
                        disabled={loading}
                    >
                        {loading ? 'Clearing...' : 'Clear Cache'}
                    </button>
                </div>

                {message ? (
                    <div className={`alert alert-${messageType} mt-3 mb-0`} role="alert">
                        {message}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
