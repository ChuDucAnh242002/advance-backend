const http = require('http')
const { Server } = require("socket.io");
// const { Kafka } = require('kafkajs');

const server = http.createServer();

const PORT = process.env.PORT || 3001;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const kafka = new Kafka({
    clientId: 'server_a',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

consumer.connect()
consumer.subscribe({ topic: 'aggregated-emote-data', fromBeginning: true })
consumer.subscribe({ topic: 'raw-emote-data', fromBeginning: true })

io.on("connection", async (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    const runConsumer = async () => {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                console.log(`- ${prefix} ${message.key}#${message.value}`)

                if (topic == "aggregated-emote-data") {
                    io.emit("aggregatedEmoteData", message)
                }
                else if (topic == "raw-emote-data") {
                    io.emit("rawEmoteData", message)
                }
            },
        })
    }

    runConsumer().catch(e => console.error(`[server_a/getRawEmoteData] ${e.message}`, e))
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${server.address().port}`);
});