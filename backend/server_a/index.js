const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// WebSocket server logic
io.on("connection", (io) => {
    console.log("Client connected");

    // WebSocket handling logic
    socket.on("message", (message) => {
        // Handle WebSocket messages
        console.log(`Received message: ${message}`)

        // Send a response back to the client
        io.emit('message', message);
    });
});

// Start the server on port 8080
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});