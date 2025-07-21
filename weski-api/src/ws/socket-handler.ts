import { Server, Socket } from "socket.io";
import {SearchFields} from "../types/SearchFields";
import {HotelIntegrationManager} from "../integrations/HotelIntegrationManager";

export function handleSocketConnection(io: Server) {
    const manager = new HotelIntegrationManager();

    io.on("connection", (socket: Socket) => {
        console.log("Client connected via socket.io");

        socket.on("search_hotels", async (payload: SearchFields) => {
            const sizes = Array.from({ length: 10 - payload.group_size + 1 }, (_, i) => payload.group_size + i);
            const hotelMap = new Map();

            try {
                for (const size of sizes) {
                    const newPayload = { ...payload, group_size: size };
                    for (const provider of manager.getProviders()) {
                        const hotels = await provider.searchHotels(newPayload);

                        for (const hotel of hotels) {
                            if (!hotelMap.has(hotel.hotel_code)) {
                                hotelMap.set(hotel.hotel_code, hotel);
                            }
                        }

                        socket.emit("result", [...hotelMap.values()]);
                    }
                }

                socket.emit("done");
            } catch (err: any) {
                console.error("Error handleSocketConnection :", err.message);
                socket.emit("error", { message: err.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}