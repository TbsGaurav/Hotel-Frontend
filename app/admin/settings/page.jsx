"use client";
import { useEffect, useState } from "react";
import { getSettingsApi, upsertSettingsApi } from '@/lib/api/admin/settingsapi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        settingId: null,
        defaultCheckin: '',
        defaultCheckout: '',
    });
    const siteName = "hotel.au";

     useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettingsApi();
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                    setSettings(data.data[0]);
                } else {
                    throw new Error('Invalid settings data format');
                }
            } catch (err) {
                toast.error(err.message || 'Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' && value !== '' ? Number(value) : value;
        setSettings(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await upsertSettingsApi(settings);
            toast.success('Settings updated successfully');
        } catch (err) {
            toast.error(err.message || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-60">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header">
                <h5 className="mb-0 fw-semibold">Settings</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Site Name */}
                        <div className="col-12 col-lg-6 mb-3">
                            <label className="form-label">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={siteName}
                                readOnly
                                className="form-control bg-light"
                            />
                        </div>

                        {/* Default Check-in Days */}
                        <div className="col-12 col-lg-6 mb-3">
                            <label className="form-label">Default Check-in Days</label>
                            <input
                                type="number"
                                name="defaultCheckin"
                                value={settings.defaultCheckin ?? ''}
                                onChange={handleChange}
                                min={0}
                                className="form-control"
                                required
                            />
                        </div>

                        {/* Default Check-out Days */}
                        <div className="col-12 col-lg-6 mb-3">
                            <label className="form-label">Default Check-out Days</label>
                            <input
                                type="number"
                                name="defaultCheckout"
                                value={settings.defaultCheckout ?? ''}
                                onChange={handleChange}
                                min={0}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="submit"
                            className="theme-button-orange rounded-2 px-4 d-flex align-items-center justify-content-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}