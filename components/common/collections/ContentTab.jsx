'use client';

import CKEditorField from '@/components/ui/CKEditorField';
import { saveContent } from '@/lib/api/admin/collectionapi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContentTab({ collectionId, data, setData, onNext, onBack, loading }) {
    const [errors, setErrors] = useState({});
    const handleNextClick = () => {
        if (!validateForm()) return;
        onNext();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));

        // 🔥 Clear error for that field when user types
        if (value?.trim()) {
            setErrors((prev) => ({
                ...prev,
                [name]: null
            }));
        }
    };
    const validateForm = () => {
        const newErrors = {};

        if (!data.header?.trim()) {
            newErrors.header = 'H1 Title is required';
        }

        if (!data.metaTitle?.trim()) {
            newErrors.metaTitle = 'Meta Title is required';
        }

        if (!data.metaDescription?.trim()) {
            newErrors.metaDescription = 'Meta Description is required';
        }

        if (!data.introShortCopy?.trim()) {
            newErrors.introShortCopy = 'Intro Short Copy is required';
        }

        if (!data.introLongCopy?.trim()) {
            newErrors.introLongCopy = 'Intro Long Copy is required';
        }

        // 🔹 FAQ Validation
        // if (data.faqs?.length) {
        //     const hasInvalidFaq = data.faqs.some((faq) => !faq.question?.trim() || !faq.answer?.trim());

        //     if (hasInvalidFaq) {
        //         toast.error('Please complete all FAQs before saving.');
        //         return false;
        //     }

        //     const questions = data.faqs.map((f) => f.question.trim().toLowerCase());

        //     const hasDuplicate = new Set(questions).size !== questions.length;

        //     if (hasDuplicate) {
        //         toast.error('Duplicate FAQ questions are not allowed.');
        //         return false;
        //     }
        // }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill all required fields');
            return false;
        }

        return true;
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">H1 Title</label>
                    <input
                        className={`form-control ${errors.header ? 'is-invalid' : ''}`}
                        value={data.header || ''}
                        name="header"
                        onChange={handleChange}
                    />
                    {errors.header && <div className="invalid-feedback">{errors.header}</div>}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Meta Title</label>
                    <input
                        className={`form-control ${errors.metaTitle ? 'is-invalid' : ''}`}
                        name="metaTitle"
                        value={data.metaTitle}
                        onChange={handleChange}
                    />
                    {errors.metaTitle && <div className="invalid-feedback">{errors.metaTitle}</div>}
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Meta Description</label>
                    <textarea
                        className={`form-control ${errors.metaDescription ? 'is-invalid' : ''}`}
                        name="metaDescription"
                        value={data.metaDescription}
                        onChange={handleChange}
                    />
                    {errors.metaDescription && <div className="invalid-feedback">{errors.metaDescription}</div>}
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Short Copy</label>
                    <CKEditorField
                        value={data.introShortCopy}
                        onChange={(val) => {
                            setData((prev) => ({
                                ...prev,
                                introShortCopy: val
                            }));

                            if (val && val.replace(/<[^>]*>/g, '').trim()) {
                                setErrors((prev) => ({
                                    ...prev,
                                    introShortCopy: null
                                }));
                            }
                        }}
                        // onChange={(val) =>
                        //     setData((prev) => ({
                        //         ...prev,
                        //         introShortCopy: val
                        //     }))
                        // }
                    />
                    {errors.introShortCopy && <div className="text-danger small mt-1">{errors.introShortCopy}</div>}
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Long Copy</label>
                    <CKEditorField
                        value={data.introLongCopy}
                        onChange={(val) => {
                            setData((prev) => ({
                                ...prev,
                                introLongCopy: val
                            }));

                            if (val && val.replace(/<[^>]*>/g, '').trim()) {
                                setErrors((prev) => ({
                                    ...prev,
                                    introLongCopy: null
                                }));
                            }
                        }}

                        // onChange={(val) =>
                        //     setData((prev) => ({
                        //         ...prev,
                        //         introLongCopy: val
                        //     }))
                        // }
                    />
                    {errors.introLongCopy && <div className="text-danger small mt-1">{errors.introLongCopy}</div>}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Hero Image URL</label>
                    <input className="form-control" name="heroImageUrl" value={data.heroImageUrl} onChange={handleChange} />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Badge</label>
                    <input className="form-control" name="badge" value={data.badge} onChange={handleChange} />
                </div>
                <div className="col-md-12 mt-4">
                    <h6>FAQs</h6>

                    {data.faqs?.map((faq, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Question"
                                    value={faq.question}
                                    onChange={(e) => {
                                        const updatedFaqs = [...data.faqs];
                                        updatedFaqs[index].question = e.target.value;
                                        setData({ ...data, faqs: updatedFaqs });
                                    }}
                                />
                            </div>

                            <div className="mb-2">
                                <textarea
                                    className="form-control"
                                    placeholder="Answer"
                                    value={faq.answer}
                                    onChange={(e) => {
                                        const updatedFaqs = [...data.faqs];
                                        updatedFaqs[index].answer = e.target.value;
                                        setData({ ...data, faqs: updatedFaqs });
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                    const updatedFaqs = data.faqs.filter((_, i) => i !== index);
                                    setData({ ...data, faqs: updatedFaqs });
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onChange={(e) => {
                            const updatedFaqs = [...data.faqs];
                            updatedFaqs[index].question = e.target.value;

                            setData({ ...data, faqs: updatedFaqs });
                        }}
                        onClick={() => {
                            const faqs = data.faqs || [];

                            // Allow first FAQ
                            if (faqs.length === 0) {
                                setData({
                                    ...data,
                                    faqs: [{ question: '', answer: '' }]
                                });
                                return;
                            }

                            const lastFaq = faqs[faqs.length - 1];

                            // 1️⃣ Prevent empty
                            if (!lastFaq.question?.trim() || !lastFaq.answer?.trim()) {
                                toast.error('Please fill Question and Answer before adding another FAQ.');
                                return;
                            }

                            // 2️⃣ Prevent duplicate question
                            const questionLower = lastFaq.question.trim().toLowerCase();

                            const duplicate = faqs.slice(0, -1).some((f) => f.question?.trim().toLowerCase() === questionLower);

                            if (duplicate) {
                                toast.error('Duplicate FAQ question is not allowed.');
                                return;
                            }

                            // Add new FAQ
                            setData({
                                ...data,
                                faqs: [...faqs, { question: '', answer: '' }]
                            });
                        }}
                    >
                        + Add FAQ
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>

                <div>
                    <button
                        className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                        onClick={handleNextClick}
                        // onClick={onNext}
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
                </div>
            </div>
        </>
    );
}
