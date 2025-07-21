import { HotelProvider } from "./HotelProvider";
import { WeskiProvider } from "./WeskiProvider";

export class HotelIntegrationManager {
    private providers: HotelProvider[] = [];

    constructor() {
        this.providers.push(new WeskiProvider());
    }

    getProviders(): HotelProvider[] {
        return this.providers;
    }
}
