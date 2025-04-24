const { Kafka } = require('kafkajs');
const axios = require('axios');

const kafka = new Kafka({
    clientId: 'emotegenerator',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const admin = kafka.admin();
const producer = kafka.producer();

const topic = 'raw-emote-data';

const createTopics = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [
            { topic: 'raw-emote-data', numPartitions: 1, replicationFactor: 1 },
            { topic: 'aggregated-emote-data', numPartitions: 1, replicationFactor: 1 }
        ]
    });

    await admin.disconnect();
};

const getRandomEmote = async (emotes) => {
    const emote = emotes[Math.floor(Math.random() * emotes.length)];
    const timestamp = new Date().toISOString();
    return { emote, timestamp };
}

const sendMessage = async (message) => {
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
    });

    //console.log('Message sent: ', message);
}

const generateEmotes = async () => {
    await createTopics();
    await producer.connect();
    const interval = await axios.get('http://server_b:8000/settings/interval',
        { headers: { 'Content-Type': 'application/json' } }
    ).then(response => {
        if (response.status !== 200) {
            console.error('Error fetching interval:', response.statusText);
            return 1000;
        }
        return response.data.interval;
    }
    ) || 1000;

    setInterval(async () => {
        const emotes = await axios.get('http://server_b:8000/settings/allowed-emotes', 
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            if (response.status !== 200) {
                console.error('Error fetching emotes:', response.statusText);
                return [];
            }
            return response.data.emotes.filter(emote => emote.active).map(emote => emote.value);
        })
        if (!emotes || emotes.length === 0) {
            console.log('No active emotes available.');
            return;
        }

        if(Math.random() < 0.2) {
            const burstEmote = emotes[Math.floor(Math.random() * emotes.length)];
            for(let i = 0; i < Math.floor(Math.random() * 51) + 50; i++) {
                const message = { emote: burstEmote, timestamp: new Date().toISOString() };
                await sendMessage(message);
            }
        } else {
            for(let i = 0; i < Math.floor(Math.random() * 16) + 5; i++) {
                const message = await getRandomEmote(emotes);
                await sendMessage(message);
            }
        }
    }, interval);
};

generateEmotes().catch(console.error);
