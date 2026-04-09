'use client';
 
import { useSearchParams } from 'next/navigation';
 
export default function SearchContent() {
    const searchParams = useSearchParams();
 
    const data = {
        destination: searchParams.get('destination'),
        destinationType: searchParams.get('destinationType'),
        destinationId: searchParams.get('destinationId'),
 
        checkIn: searchParams.get('checkIn')
            ? new Date(searchParams.get('checkIn'))
            : null,
 
        checkOut: searchParams.get('checkOut')
            ? new Date(searchParams.get('checkOut'))
            : null,
 
        guests: Number(searchParams.get('guests') || 0),
        rooms: Number(searchParams.get('rooms') || 0),
 
        children: {
            count: Number(searchParams.get('children') || 0),
            ages: searchParams.get('childrenAges')
                ? searchParams.get('childrenAges').split(',').map(Number)
                : []
        }
    };
 
    return (
<div style={{ padding: 40 }}>
<h3>Search Results Page</h3>
<pre>{JSON.stringify(data, null, 2)}</pre>
</div>
    );
}