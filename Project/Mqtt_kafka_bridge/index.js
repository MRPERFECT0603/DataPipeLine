const mqtt = require('mqtt');
const { Kafka, Partitioners } = require('kafkajs');


const mqttHost = 'mqtt://hivemq-service:1883';  
const mqttTopic = 'testtopic/vivek';


const kafkaBroker = 'kafka-service:9092';     
const kafkaTopic = 'vivek';


const mqttClient = mqtt.connect(mqttHost);


const kafka = new Kafka({
  brokers: [kafkaBroker],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const start = async () => {
  await producer.connect();

  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(mqttTopic, (err) => {
      if (err) {
        console.error('Failed to subscribe to MQTT topic:', err);
      } else {
        console.log(`Subscribed to MQTT topic: ${mqttTopic}`);
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    console.log(`Received message from MQTT topic ${topic}:`, message.toString());

    try {
      await producer.send({
        topic: kafkaTopic,
        messages: [{ value: message.toString() }],
      });
      console.log(`Message forwarded to Kafka topic ${kafkaTopic}`);
    } catch (error) {
      console.error('Failed to send message to Kafka:', error);
    }
  });
};

start().catch(console.error);