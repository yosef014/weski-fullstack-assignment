import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/env";
import { handleSocketConnection } from "./ws/socket-handler";

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

handleSocketConnection(io);

server.listen(config.port, () => {
    console.log(`Socket.io server running at http://localhost:${config.port}`);
});
