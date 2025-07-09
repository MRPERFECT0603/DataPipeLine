const  mqtt  = require('mqtt');
const { Kafka } = require('kafkajs');

// MQTT Configuration
const mqttHost = 'mqtt://hivemq-service:1883'; // Replace with your MQTT broker address
const mqttTopic = 'testtopic/vivek'; // Replace with your MQTT topic

// Kafka Configuration
const kafkaBroker = 'kafka-service:9092'; // Replace with your Kafka broker address
const kafkaTopic = 'vivek'; // Replace with your Kafka topic

// Create an MQTT client
const mqttClient = mqtt.connect(mqttHost);

// Create a Kafka client
const kafka = new Kafka({
  brokers: [kafkaBroker],
});

const producer = kafka.producer("createPartitioner: Partitioners.LegacyPartitioner");

const start = async () => {
  // Connect to the Kafka producer
  await producer.connect();

  // Connect to the MQTT broker
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

  // Handle incoming MQTT messages
  mqttClient.on('message', async (topic, message) => {
    console.log(`Received message from MQTT topic ${topic}:`, message.toString());

    // Produce the message to Kafka
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