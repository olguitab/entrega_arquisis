const mqtt = require('mqtt');
const axios = require('axios');

// Asegúrate de tener definidas estas variables de entorno o reemplázalas con valores directos para pruebas.
const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;
const appUrl = process.env.APP_URL;

const client = mqtt.connect(mqttBrokerUrl, {
  username: mqttUsername,
  password: mqttPassword,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe(['fixtures/info', 'fixtures/validation', 'fixtures/request'], (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/info, fixtures/request and fixtures/validation');
    }
  });
});

client.on('message', async (topic, message) => {
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
      /*case 'fixtures/requests':
        endpoint = '/fixtures/request';
        break;*/
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

async function fetchAndPublish() {
  try {
    const getInfoResponse = await axios.get(`${appUrl}/pre-validate-bet`);
    console.log('Información obtenida con éxito:', getInfoResponse.data);

    if (getInfoResponse.data.length === 0) {
      console.log('No hay datos para procesar.');
    } else {
      // Asumiendo que siempre quieras enviar el primer objeto del arreglo
      const firstItem = getInfoResponse.data[0]; // Selecciona el primer objeto
      const messageString = JSON.stringify(firstItem); // Convierte ese objeto a String
      client.publish('fixtures/requests', messageString, { qos: 1 }, (err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log('Message published to fixtures/requests');
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo información:', error);
  } finally {
    // Re-programa la ejecución independientemente del resultado
    setTimeout(fetchAndPublish, 120000); // 2 minutos
  }
}

// Inicia el ciclo de obtención y publicación
fetchAndPublish();