const http = require('http')
const { Server } = require("socket.io");
const { Kafka } = require('kafkajs');

const server = http.createServer();

const PORT = process.env.PORT || 3001;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    // The settings ensure that the server will connect to the frontend
    pingInterval: 5000,
    pingTimeout: 5000,
    connectionStateRecovery: true,
});

const kafka = new Kafka({
    clientId: 'server_a',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'server_a_group' });

consumer.connect()
consumer.subscribe({ topic: 'aggregated-emote-data', fromBeginning: true })
consumer.subscribe({ topic: 'raw-emote-data', fromBeginning: true })

io.on("connection", async (socket) => {
    // If the connection is on then log client connected
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    // For each message that the consumer receives, emit the message for the frontend to use
    const runConsumer = async () => {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (topic == "aggregated-emote-data") {
                    io.emit("aggregatedEmoteData", message)
                }
            },
        })
    }

    runConsumer().catch(e => console.error(`[server_a/getRawEmoteData] ${e.message}`, e))
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${server.address().port}`);
});