const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe('fixtures/info', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic: fixtures/info');
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const parsedMessage = JSON.parse(JSON.parse(message.toString()));
    console.log('Received message, sending to app...');

    await axios.post(`${process.env.APP_URL}/fixtures/process`, {
      topic,
      message: parsedMessage,
    });
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});
