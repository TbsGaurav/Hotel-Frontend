'use client';
import CreateCollection from '@/components/common/collections/CreateCollection';
import { useParams } from 'next/navigation';

export default function EditCollectionPage() {
    const params = useParams();
    const id = params.id;

    return <CreateCollection collectionId={id} />;
}
