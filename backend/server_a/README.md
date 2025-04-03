# Server A

Server A will get the the aggregated emote data and raw emote data through emote generator and send to the frontend via websocket.

# Testing

Install the package to test. Note that this package is not required in development, therefore, it is not included in package.json
```bash
npm install socket.io-client
```

This is the test.js template for testing (not required in development):

const { io } = require("socket.io-client");

const URL = "http://localhost:3001"

const socket = io(URL)

socket.on("connect", (data) => {
    console.log("Client connected")
});

socket.on("rawEmoteData", (data) => {
    console.log(`Raw emote data: ${data.value}`)
})


In order to test, emote generator and kafka must be implemented. And the server A will be built using docker compose 

```bash
docker compose build
```

And run the all the services with this command (emote generator and kafka are required):
```bash
docker compose up
```

Finally run 
```bash
node test.js
```
