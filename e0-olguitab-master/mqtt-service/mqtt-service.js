const mqtt = require('mqtt');
const axios = require('axios');

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;
const appUrl = process.env.APP_URL;

// Bandera para controlar el estado de procesamiento de mensajes
let readyToProcessRequests = false;

const client = mqtt.connect(mqttBrokerUrl, {
  username: mqttUsername,
  password: mqttPassword,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe(['fixtures/info', 'fixtures/validation', 'fixtures/requests'], (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/info, fixtures/request and fixtures/validation');
      // Activa la bandera después de un breve retraso para evitar procesar mensajes inmediatamente después de suscribirse
      setTimeout(() => {
        readyToProcessRequests = true;
      }, 10000); // Espera 10 segundos antes de empezar a procesar mensajes
    }
  });
});

client.on('message', async (topic, message) => {
  // Ignora los mensajes si el sistema no está listo para procesar solicitudes
  if (!readyToProcessRequests && topic === 'fixtures/requests') {
    console.log('Skipping message as system is not ready to process requests.');
    return;
  }

  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log(`Received message on topic ${topic}`);

    let endpoint = '';
    switch (topic) {
      case 'fixtures/validation':
        endpoint = '/validate-bet';
        break;
      case 'fixtures/info':
        endpoint = '/fixtures/process';
        break;
      case 'fixtures/requests':
        endpoint = '/requests';
        break;
      default:
        console.log(`No handler for topic ${topic}`);
        return;
    }

    const response = await axios.post(`${appUrl}${endpoint}`, {
      topic,
      message: parsedMessage,
    });
    console.log(`Data sent to ${endpoint}, response:`, response.data);
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// Inicia el ciclo de obtención y publicación
fetchAndPublish();

async function fetchAndPublish() {
  // Tu lógica existente aquí
}