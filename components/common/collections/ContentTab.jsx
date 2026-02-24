'use client';

import { saveContent } from '@/lib/api/admin/collectionapi';

export default function ContentTab({ collectionId, data, setData, onNext, onBack }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!collectionId) {
            alert('Please save Basic first.');
            return;
        }
        // 1️⃣ Check incomplete FAQ
        const hasInvalidFaq = data.faqs?.some((faq) => !faq.question?.trim() || !faq.answer?.trim());

        if (hasInvalidFaq) {
            alert('Please complete all FAQs before saving.');
            return;
        }

        // 2️⃣ Check duplicate questions
        const questions = data.faqs.map((f) => f.question.trim().toLowerCase());

        const hasDuplicate = new Set(questions).size !== questions.length;

        if (hasDuplicate) {
            alert('Duplicate FAQ questions are not allowed.');
            return;
        }
        const payload = {
            header: data.header,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            introShortCopy: data.introShortCopy,
            introLongCopy: data.introLongCopy,
            heroImageUrl: data.heroImageUrl,
            badge: data.badge,
            faQsJson: JSON.stringify(data.faqs || []),
            userId: 1
        };

        try {
            await saveContent(collectionId, payload);
            // alert('Content saved successfully');
        } catch (err) {
            console.error(err);
            alert('Error saving content');
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Header</label>
                    <input
                        className="form-control"
                        // name="h1"
                        // value={data.h1}
                        value={data.header || ''}
                        name="header"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Meta Title</label>
                    <input className="form-control" name="metaTitle" value={data.metaTitle} onChange={handleChange} />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Meta Description</label>
                    <textarea className="form-control" name="metaDescription" value={data.metaDescription} onChange={handleChange} />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Short Copy</label>
                    <textarea className="form-control" name="introShortCopy" value={data.introShortCopy} onChange={handleChange} />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Long Copy</label>
                    <textarea className="form-control" name="introLongCopy" rows={4} value={data.introLongCopy} onChange={handleChange} />
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
                                alert('Please fill Question and Answer before adding another FAQ.');
                                return;
                            }

                            // 2️⃣ Prevent duplicate question
                            const questionLower = lastFaq.question.trim().toLowerCase();

                            const duplicate = faqs.slice(0, -1).some((f) => f.question?.trim().toLowerCase() === questionLower);

                            if (duplicate) {
                                alert('Duplicate FAQ question is not allowed.');
                                return;
                            }

                            // Add new FAQ
                            setData({
                                ...data,
                                faqs: [...faqs, { question: '', answer: '' }]
                            });
                        }}
                        // onClick={() => {
                        //     const faqs = data.faqs || [];

                        //     // If no FAQ exists, allow first one
                        //     if (faqs.length === 0) {
                        //         setData({
                        //             ...data,
                        //             faqs: [{ question: '', answer: '' }]
                        //         });
                        //         return;
                        //     }

                        //     const lastFaq = faqs[faqs.length - 1];

                        //     // // Check if last FAQ is incomplete
                        //     if (!lastFaq.question?.trim() || !lastFaq.answer?.trim()) {
                        //         // alert('Please fill Question and Answer before adding another FAQ.');
                        //         return;
                        //     }

                        //     // Add new FAQ
                        //     setData({
                        //         ...data,
                        //         faqs: [...faqs, { question: '', answer: '' }]
                        //     });
                        // }}
                        // onClick={() =>
                        //     setData({
                        //         ...data,
                        //         faqs: [...data.faqs, { question: '', answer: '' }]
                        //     })
                        // }
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
                    <button className="btn btn-success me-2" onClick={handleSave}>
                        Save Draft
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            await handleSave();
                            onNext();
                        }}
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </>
    );
}
