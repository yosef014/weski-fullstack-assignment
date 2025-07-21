import axios from "axios";
import { config } from "../config/env";
import { SearchFields } from "../types/SearchFields";
import { FormattedHotel } from "../types/FormattedHotel";
import { HotelProvider } from "./HotelProvider";

export class WeskiProvider implements HotelProvider {
    async searchHotels(params: SearchFields): Promise<FormattedHotel[]> {
        const { ski_site, from_date, to_date, group_size } = params;
        try {
            const response = await axios.post(config.apiUrl, {
                query: { ski_site, from_date, to_date, group_size }
            });
            const accommodations = response.data?.body?.accommodations || [];
            return this.formatHotels(accommodations);
        } catch (err) {
            console.error("WeskiProvider error:", err);
            return [];
        }
    }

    private formatHotels(hotels: any[]): FormattedHotel[] {
        const map = new Map<string, FormattedHotel>();

        for (const hotel of hotels) {
            const key = hotel.HotelCode;
            if (!key) continue;

            const price = Number(hotel?.PricesInfo?.AmountAfterTax ?? 0);
            if (map.has(key)) continue;

            const images = hotel.HotelDescriptiveContent?.Images ?? [];
            const mainImage =
                images.find((img) => img.MainImage === "True")?.URL || images[0]?.URL || null;

            map.set(key, {
                hotel_code: key,
                hotel_name: hotel.HotelName ?? "Unnamed",
                rating: hotel.HotelInfo?.Rating ?? null,
                price: price,
                main_image_url: mainImage,
            });
        }

        return [...map.values()].sort((a, b) => a.price - b.price);
    }
}
