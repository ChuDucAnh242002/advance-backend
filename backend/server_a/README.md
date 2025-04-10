# Server A

Server A will get the the aggregated emote data and raw emote data through emote generator and send to the frontend via websocket.

# Testing

# 1. Install test dependency (run this first)
```bash
npm install socket.io-client
```

# 2. Create and populate the test file server_a/test.js
```bash
const { io } = require("socket.io-client");

const URL = "http://localhost:3001"

const socket = io(URL)

socket.on("connect", (data) => {
    console.log("Client connected")
});

socket.on("rawEmoteData", (data) => {
    console.log(`Raw emote data: ${data.value}`)
})
```

# 3. Build and start services
```bash
docker compose build
docker compose up &
```

# 4. Run the test (in a new terminal or after services are up)
```bash
node server_a/test.js
```