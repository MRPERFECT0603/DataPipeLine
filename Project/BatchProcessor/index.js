const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Message = require('./model');

const kafka = new Kafka({
  brokers: ['kafka-service:9092'], 
});

const consumer = kafka.consumer({ groupId: 'batch-group' });

const BATCH_SIZE = 5;
let batch = [];

const run = async () => {
  await mongoose.connect('mongodb+srv://vivekshaurya62:datapipeline@datacluster.qonoksl.mongodb.net/IotData?retryWrites=true&w=majority&appName=datacluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB via Mongoose');

  await consumer.connect();
  await consumer.subscribe({ topic: 'vivek', fromBeginning: true });
  console.log('Connected to Kafka');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('Kafka Message:', payload);

      batch.push(payload);

      if (batch.length >= BATCH_SIZE) {
        try {
          await Message.insertMany(batch);
          console.log(`Inserted ${batch.length} messages to MongoDB`);
          batch = [];
        } catch (err) {
          console.error('Error inserting batch:', err);
        }
      }
    },
  });
};

run().catch(console.error);