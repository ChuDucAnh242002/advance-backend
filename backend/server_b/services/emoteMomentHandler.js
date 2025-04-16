const { Kafka } = require('kafkajs');
const { analyzeEmotes } = require('./analyzeEmotes');
const { getConfig } = require('./configManager');


const kafka = new Kafka({
    clientId: 'server_b',
    brokers: [process.env.KAFKA_BROKER ||'kafka1:9092']
  })

const consumerTopic = 'raw-emote-data';
const consumer = kafka.consumer({ groupId: 'server_b_group' });

const admin = kafka.admin();
const producer = kafka.producer();
const producerTopic = 'aggregated-emote-data';

const { threshold } = getConfig();

const sendMeaningfulMoments = async (moments) => {
    try{
    await admin.connect();
    const topic = await admin.listTopics();
    if(!topic.includes(producerTopic)){
      await admin.createTopics({
        topics: [
            { topic: producerTopic, numPartitions: 1, replicationFactor: 1 }
        ]
    });
    }
    await producer.connect();
    await producer.send({
        topic: producerTopic,
        messages: [{ value: JSON.stringify(moments) }]
    });
    await producer.disconnect();
    await admin.disconnect();
    console.log('Meaningful moments sent to producer:', moments);
    }catch(error){
        console.error('Error sending meaningful moments:', error);
    }
 };

const consumRawEmotes = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: consumerTopic, fromBeginning: true })
    
    const emoteCollection = [];
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if(emoteCollection.length < 100){
          emoteCollection.push(JSON.parse(message.value.toString()));

        }else{
            const moments = analyzeEmotes(emoteCollection, threshold);
            if(moments.length > 0) {
                await sendMeaningfulMoments(moments);
                emoteCollection.length = 0;
            }else{
                emoteCollection.shift();
            }

            emoteCollection.push(JSON.parse(message.value.toString()));
        }
      },
    })
};

consumRawEmotes().catch("consume emotes error",console.error);



