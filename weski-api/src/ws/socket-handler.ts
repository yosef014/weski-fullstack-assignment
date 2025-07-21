import { Server, Socket } from "socket.io";
import { getHotelsBySize, extractAndSortUniqueHotels } from "../services/hotel.service";
import {SearchFields} from "../types/SearchFields";

export function handleSocketConnection(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("Client connected via socket.io");

        socket.on("search_hotels", async (payload: SearchFields) => {
            const sizes = Array.from({ length: 10 - payload.group_size + 1 }, (_, i) => payload.group_size + i);
            const hotelMap = new Map();

            try {
                for (const size of sizes) {
                    const hotels = await getHotelsBySize({...payload, group_size: size });
                    const sortedHotels = extractAndSortUniqueHotels(hotels, hotelMap);
                    socket.emit("result", sortedHotels);
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