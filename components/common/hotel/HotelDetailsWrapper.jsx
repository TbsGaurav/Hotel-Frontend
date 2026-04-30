import { getHotelByUrl, getHotelRates } from '@/lib/api/public/hotelapi';
import HotelDetails from '@/components/common/hotel/HotelDetails';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { countryToCurrency } from '@/lib/utils';

export default async function HotelDetailsWrapper({ city, hotel }) {
    // Fetch hotel data on server
    const urlName = `/${city}/${hotel}`;
    const response = await getHotelByUrl(urlName);

    if (!response || response.status !== 'success' || !response?.data?.hotel) {
        return notFound();
    }

    const hotelData = response.data;
    const hotelInfo = hotelData.hotel;
    const bookingId = Number.isInteger(Number(hotelInfo?.bookingId)) ? Number(hotelInfo.bookingId) : null;

    // Detect currency on server via headers (Cloudflare or standard)
    const headersList = await headers();
    const country = headersList.get('cf-ipcountry') || headersList.get('x-vercel-ip-country');
    const currency = countryToCurrency(country);

    let initialRate = null;
    if (bookingId) {
        try {
            const ratesPayload = {
                bookingIds: [bookingId],
                currency,
                rooms: 1,
                adults: 2,
                childs: 0,
                device: 'desktop',
                checkIn: null,
                checkOut: null
            };
            const ratesRes = await getHotelRates(ratesPayload);
            const rates = ratesRes?.data || [];
            initialRate = rates.find((rate) => String(rate?.id) === String(bookingId)) || null;
        } catch (error) {
            console.error('Error fetching initial hotel rate on server:', error);
        }
    }

    return <HotelDetails initialData={hotelData} initialRate={initialRate} initialRateCurrency={currency} />;
}