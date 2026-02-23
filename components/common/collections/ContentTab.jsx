'use client';

import { saveContent } from '@/lib/api/admin/collectionapi';

export default function ContentTab({
    collectionId,
    data,
    setData,
    onNext,
    onBack
}) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!collectionId) {
            alert("Please save Basic first.");
            return;
        }

        const payload = {
            collectionId,
            header: data.header,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            introShortCopy: data.introShortCopy,
            introLongCopy: data.introLongCopy,
            heroImageUrl: data.heroImageUrl,
            badge: data.badge,
            faqsJson: JSON.stringify(data.faqs),
            userId: 1
        };

        const res = await saveContent(payload);

        if (res.statusCode === 200) {
            alert("Content saved successfully");
        } else {
            alert("Error saving content");
        }
    };

    return (
        <>
            <div className="row">

                <div className="col-md-6 mb-3">
                    <label className="form-label">H1</label>
                    <input className="form-control"
                        name="h1"
                        value={data.h1}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Meta Title</label>
                    <input className="form-control"
                        name="metaTitle"
                        value={data.metaTitle}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Meta Description</label>
                    <textarea className="form-control"
                        name="metaDescription"
                        value={data.metaDescription}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Short Copy</label>
                    <textarea className="form-control"
                        name="introShortCopy"
                        value={data.introShortCopy}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-12 mb-3">
                    <label className="form-label">Intro Long Copy</label>
                    <textarea className="form-control"
                        name="introLongCopy"
                        rows={4}
                        value={data.introLongCopy}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Hero Image URL</label>
                    <input className="form-control"
                        name="heroImageUrl"
                        value={data.heroImageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Badge</label>
                    <input className="form-control"
                        name="badge"
                        value={data.badge}
                        onChange={handleChange}
                    />
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

                    <button className="btn btn-primary" onClick={onNext}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}