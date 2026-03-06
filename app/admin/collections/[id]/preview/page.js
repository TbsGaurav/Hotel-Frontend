import PreviewUI from '@/components/common/collections/PreviewUI';
import { getCollectionById } from '@/lib/api/admin/collectionapi';

export default async function Page({ params }) {
    const { id } = await params;
    const res = await getCollectionById(id);

    return <PreviewUI initialData={res?.data} id={id} />;
}
