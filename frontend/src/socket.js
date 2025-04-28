import { io } from "socket.io-client";

const URL = "http://localhost:3001";

export const socket = io(URL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

export const connectSocket = (setIsConnected) => {
    // Initialize socket event listeners
    socket.connect();

    socket.on("connect", (data) => {
        setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
        setIsConnected(false);
        if (reason === "transport close") {
            socket.connect();
        }
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on("error", (err) => {
        console.log("General socket error:", err);
    });
};

export const disconnectSocket = () => {
    // Remove event listeners in order to prevent duplicate event registrations.
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("error");
};