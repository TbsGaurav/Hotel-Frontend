
'use client';

import { useState, useEffect } from 'react';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';

export default function MobileFilterDrawer({ sidebarSections, triggerClass = 'mobile-actions__link' }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <button type="button" className={triggerClass} onClick={() => setOpen(true)}>
                Filter
            </button>

            {open && (
                <div className="mobile-filter-overlay" onClick={() => setOpen(false)}>
                    <div className={`mobile-filter-drawer ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-filter-header position-relative p-3 ">
                            <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setOpen(false)} />
                        </div>

                        <div className="mobile-filter-body p-3">
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
