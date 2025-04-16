const { Kafka } = require('kafkajs');
const { analyzeEmotes } = require('./analyzeEmotes');
const { getConfig } = require('./configManager');


const kafka = new Kafka({
    clientId: 'server_b',
    brokers: [process.env.KAFKA_BROKER ||'kafka1:9092']
  })

const consumerTopic = 'raw-emote-data';

const consumer = kafka.consumer({ groupId: 'server_b_group' });

const { threshold } = getConfig();

const consumRawEmotes = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: consumerTopic, fromBeginning: true })
    
    const emoteCollection = [];
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if(emoteCollection.length < 100){
          emoteCollection.push(JSON.parse(message.value.toString()));

        }else{
            console.log(analyzeEmotes(emoteCollection, threshold));
            console.log(JSON.stringify(emoteCollection, null, 2));
            emoteCollection.length = 0;
            emoteCollection.push(JSON.parse(message.value.toString()));
        }
      },
    })
};

consumRawEmotes().catch("##### from moment",console.error);


