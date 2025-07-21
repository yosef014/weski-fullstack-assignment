import { SearchFields } from "../types/SearchFields";
import { FormattedHotel } from "../types/FormattedHotel";

export interface HotelProvider {
    searchHotels(params: SearchFields): Promise<FormattedHotel[]>;
}
