import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BasicsTab({ formData, setFormData, onNext, loading }) {
    const router = useRouter();
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.slug?.trim()) {
            newErrors.slug = 'Slug is required';
        }

        if (!formData.template) {
            newErrors.template = 'Template is required';
        }
        if (!formData.maxHotels || formData.maxHotels < 1) {
            newErrors.maxHotels = 'Max Hotels must be at least 1';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const handleCancel = () => {
        router.push('/collections');
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const generatedSlug = generateSlug(value);

            setFormData((prev) => ({
                ...prev,
                name: value,
                slug: generatedSlug
            }));

            // 🔥 Clear both name & slug errors
            setErrors((prev) => ({
                ...prev,
                name: null,
                slug: generatedSlug ? null : prev.slug
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));

            // 🔥 Clear only that field's error
            if (value?.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: null
                }));
            }
        }
    };
    const handleNextClick = () => {
        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        onNext();
    };

    return (
        <>
            <div className="row">
                {/* Collection Name */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Collection Name </label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter collection name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Slug */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Slug </label>
                    <input
                        type="text"
                        className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="collection-slug"
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                </div>

                {/* Template */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Template</label>

                    <select
                        className={`form-select ${errors.template ? 'is-invalid' : ''}`}
                        name="template"
                        value={formData.template}
                        onChange={handleChange}
                    >
                        <option value="">Select Template</option>
                        <option value="Family">Family</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Business">Business</option>
                        <option value="Budget">Budget</option>
                    </select>

                    {errors.template && <div className="invalid-feedback d-block">{errors.template}</div>}
                </div>

                {/* Status */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Status</label>
                    <div className="d-flex gap-3">
                        <div>
                            <input type="radio" name="status" value="Draft" checked={formData.status === 'Draft'} onChange={handleChange} />{' '}
                            Draft
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="status"
                                value="Published"
                                checked={formData.status === 'Published'}
                                onChange={handleChange}
                            />{' '}
                            Published
                        </div>
                    </div>
                </div>

                {/* Expiry Date */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                </div>

                {/* Max Hotels */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Max Hotels</label>
                    <input
                        type="number"
                        min="1"
                        className={`form-control ${errors.maxHotels ? 'is-invalid' : ''}`}
                        name="maxHotels"
                        value={formData.maxHotels}
                        onChange={handleChange}
                        placeholder="Enter maximum number of hotels"
                    />
                    {errors.maxHotels && <div className="invalid-feedback">{errors.maxHotels}</div>}
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                    Cancel
                </button>

                <button
                    className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                    // onClick={onNext}
                    onClick={handleNextClick}
                    type="button"
                    disabled={loading}
                    style={{ minWidth: '100px' }}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {/* Loading... */}
                        </>
                    ) : (
                        'Next'
                    )}
                </button>
                {/* <button className="theme-button-orange rounded-2" onClick={onNext} type="button">
                    Next
                </button> */}
            </div>
        </>
    );
}
