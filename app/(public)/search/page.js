'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();

    const data = {
        destination: searchParams.get('destination'),
        destinationType: searchParams.get('destinationType'),
        destinationId: searchParams.get('destinationId'),

        checkIn: new Date(searchParams.get('checkIn')),
        checkOut: new Date(searchParams.get('checkOut')),

        guests: Number(searchParams.get('guests')),
        rooms: Number(searchParams.get('rooms')),

        children: {
            count: Number(searchParams.get('children')),
            ages: searchParams.get('childrenAges') ? searchParams.get('childrenAges').split(',').map(Number) : []
        }
    };

    console.log('SEARCH PAGE DATA 👉', data);

    return (
        <div style={{ padding: 40 }}>
            <h3>Search Results Page</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
