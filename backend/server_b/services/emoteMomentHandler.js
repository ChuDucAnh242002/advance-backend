const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'server_b',
    brokers: [process.env.KAFKA_BROKER ||'kafka1:9092']
  })

const consumerTopic = 'raw-emote-data';

const consumer = kafka.consumer({ groupId: 'server_b_group' });

const consumRawEmotes = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: consumerTopic, fromBeginning: true })
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        })
      },
    })
};

consumRawEmotes().catch("##### from moment",console.error);


