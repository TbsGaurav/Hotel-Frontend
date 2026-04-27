'use client';
import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';
import Link from 'next/link';
import { ensureHtm } from '@/lib/utils';

/**
 * A wrapper around next/link that ensures the .htm extension
 * is visible on hover, while safely routing to the clean application path natively.
 */
const AppLink = forwardRef(({ href, children, onMouseEnter, onClick, prefetch = true, ...props }, ref) => {
    const router = useRouter();

    if (typeof href !== 'string') {
        return (
            <Link ref={ref} href={href} onClick={onClick} onMouseEnter={onMouseEnter} {...props}>
                {children}
            </Link>
        );
    }

    // This guarantees the .htm shows in the browser's bottom-left hover preview
    const htmHref = ensureHtm(href);

    const handleClick = (e) => {
        if (onClick) onClick(e);
        
        // Prevent default browser navigation. Let Next.js client router handle it using the clean URL.
        if (!e.defaultPrevented && !props.target && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            router.push(href);
        }
    };

    return (
        <a 
            ref={ref} 
            href={htmHref} 
            onClick={handleClick}
            onMouseEnter={(e) => {
                if (prefetch) {
                    router.prefetch(href);
                }
                if (onMouseEnter) onMouseEnter(e);
            }}
            {...props}
        >
            {children}
        </a>
    );
});

AppLink.displayName = 'AppLink';

export default AppLink;
