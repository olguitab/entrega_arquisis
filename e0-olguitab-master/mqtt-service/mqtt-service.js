const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  // Suscribirse a ambos topics necesarios
  client.subscribe(['fixtures/info', 'fixtures/validation'], (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/info and fixtures/validation');
    }
  });
});

client.on('message', async (topic, message) => {
  if (topic === 'fixtures/validation') {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log('Received message, sending to app...');

      await axios.post(`${process.env.APP_URL}/validate-bet`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  } else if (topic === 'fixtures/info') {
    // Procesar mensajes de fixtures/info como antes
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log('Received message, sending to app...');

      await axios.post(`${process.env.APP_URL}/fixtures/process`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }
});


async function fetchAndPublish() {
    try {
      // Primero, realiza una solicitud GET para obtener la información necesaria
      const getInfoResponse = await axios.get(`http://127.0.0.1:3001/pre-validate-bet`);
      console.log('Información obtenida con éxito:', getInfoResponse.data);
      const message = JSON.stringify(getInfoResponse);
  
      // Publica el mensaje a MQTT y luego realiza la solicitud POST
      client.publish('fixtures/request', message, {}, async (err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log('Message published to fixtures/request');
          try {
            // Realiza la solicitud POST con los detalles de la apuesta
            const postResponse = await axios.post(`${process.env.APP_URL}/fixtures/request`, betDetails);
            console.log('Bet placed successfully:', postResponse.data);
          } catch (postError) {
            console.error('Error placing bet:', postError);
          }
        }
      });
      setTimeout(fetchAndPublish, 100000);
    } catch (getError) {
      console.error('Error obteniendo información:', getError);
      setTimeout(fetchAndPublish, 100000);
    }
  
}


fetchAndPublish() 