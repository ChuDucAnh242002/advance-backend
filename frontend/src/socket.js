import { io } from "socket.io-client"

const URL = "http://localhost:3001"

export const socket = io(URL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});