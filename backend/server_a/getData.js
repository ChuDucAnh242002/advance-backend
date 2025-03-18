const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'server_a',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const getAggregatedEmoteData = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'aggregated-emote-data', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
        },
    })
};

const getRawEmoteData = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'raw-emote-data', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
        },
    })
}

// This is for testing purposes
getAggregatedEmoteData().catch(e => console.error(`[server_a/getRawEmoteData] ${e.message}`, e))
getRawEmoteData().catch(e => console.error(`[server_a/getRawEmoteData] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
    process.on(type, async e => {
        try {
            console.log(`process.on ${type}`)
            console.error(e)
            await consumer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.forEach(type => {
    process.once(type, async () => {
        try {
            await consumer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})

export { getAggregatedEmoteData, getRawEmoteData }