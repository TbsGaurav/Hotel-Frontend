import { getHotelByUrl } from '@/lib/api/public/hotelapi';
import HotelDetails from '@/components/common/hotel/HotelDetails';
import { notFound } from 'next/navigation';

export default async function HotelDetailsWrapper({ city, hotel }) {
    // Fetch hotel data on server
    const urlName = `/${city}/${hotel}`;
    const response = await getHotelByUrl(urlName);

    if (!response || response.status !== 'success' || !response?.data?.hotel) {
        return notFound();
    }

    const hotelData = response.data;

    return <HotelDetails initialData={hotelData} />;
}