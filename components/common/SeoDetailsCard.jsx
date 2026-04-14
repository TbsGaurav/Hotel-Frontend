export default function SeoDetailsCard({ heading, metaTitle, metaDescription, canonicalPath }) {
    return (
        <div className="mx-2 mx-md-0 mb-4 p-3 p-md-4 ">
            <div className="row g-3 align-items-start">
                <div className="col-12 col-lg-8 pe-lg-4">
                    <h1 className="fs-3 fw-semibold mb-3 text-dark text-break">{metaTitle}</h1>
                    <div className="mb-0 text-muted lh-base" dangerouslySetInnerHTML={{ __html: metaDescription || '' }} />
                </div>
            </div>
        </div>
    );
}
