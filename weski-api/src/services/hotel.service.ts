import axios from 'axios';
import { config } from '../config/env';
import {SearchFields} from "../types/SearchFields";
import {HotelResponse} from "../types/HotelResponse";
import {FormattedHotel} from "../types/FormattedHotel";

export async function getHotelsBySize(params: SearchFields): Promise<HotelResponse[]> {
    try {
        const { ski_site, from_date, to_date, group_size } = params;
       const response= await axios.post(config.apiUrl, {
            query: { ski_site, from_date, to_date, group_size: group_size }
        });
        return response.data?.body?.accommodations || [];
    } catch (err) {
        console.error('Error getHotelsBySize: ', params.group_size);
        return [];
    }
}
export function extractAndSortUniqueHotels(hotels: HotelResponse[], mapByRefernce): FormattedHotel[] {
    for (const hotel of hotels) {
        const key = hotel.HotelCode;
        if (!key) continue;

        const price = Number(hotel?.PricesInfo?.AmountAfterTax ?? 0);

        const existing = mapByRefernce.get(key);

        if (!existing) {
            const images = hotel.HotelDescriptiveContent?.Images ?? [];
            const mainImage =
                images.find((img) => img.MainImage === 'True')?.URL ||
                images[0]?.URL ||
                null;

            mapByRefernce.set(key, {
                hotel_code: key,
                hotel_came: hotel.HotelName ?? 'Unnamed',
                rating: hotel.HotelInfo?.Rating ?? null,
                price: price,
                main_image_url: mainImage,
            });
        }
    }
    const sortedHotels = [...mapByRefernce.values()].sort((a, b) => a.price - b.price)
    return sortedHotels;
}