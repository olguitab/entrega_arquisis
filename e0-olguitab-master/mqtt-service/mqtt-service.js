const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});


client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  // Suscribirse a ambos topics necesarios
  client.subscribe('fixtures/info', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/info');
    }
  });
  client.subscribe('fixtures/validation', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/validation');
    }
  });
  client.subscribe('fixtures/history', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/history):', err);
    } else {
      console.log('Subscribed to topic: fixtures/history');

    }
  });
  client.subscribe('fixtures/requests', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/requests):', err);
    } else {
      console.log('Subscribed to topic: fixtures/requests');
        // Activa la bandera después de un breve retraso para evitar procesar mensajes inmediatamente después de suscribirse
    }
  });
});


// Mensajes
client.on('message', async (topic, message) => {

  if (topic === 'fixtures/validation') {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log('Recibiendo validación...');
      const getInfoResponse = await axios.get(`${process.env.APP_URL}/pre-validate-bet`);

      // Verificar si la respuesta está vacía. Ajusta esta condición según lo que esperes como respuesta vacía.
      if (getInfoResponse.data.length === 0) {
        // Si está vacío, simplemente no hagas nada y retorna o sigue con otra lógica.
        console.log('No hay datos para procesar.');
        return;
      }
        // Envuelve el parsedMessage en un objeto con una propiedad 'message'
        const payload = {
          message: parsedMessage
        };
      await axios.post(`${process.env.APP_URL}/validate-bet`, payload 
      );
    } catch (error) {
      console.error('Error processing MQTT message VALIDACION:', error);
    }
  } else if (topic === 'fixtures/info') {
    // Procesar mensajes de fixtures/info como antes
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message, sending to app...');
      await axios.post(`${process.env.APP_URL}/fixtures/process`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }} else if (topic === 'fixtures/requests') {
    try {
      const parsedMessage = message.toString();
      console.log('String JSON:', message.toString());
      console.log('Received message on fixtures/request, sending to app...');
      //console.log('string json:', message.toString());

      await axios.post(`${process.env.APP_URL}/requests`,parsedMessage
      );
    } catch (error) {
      console.error('Error processing MQTT message: REQUESTS', error);
    }
  }

  /*else if (topic === 'fixtures/history') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/history, sending to app...');

      await axios.patch(`${process.env.APP_URL}/fixtures/history`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message: HISTORIA', error);
    }
  }*/
});

async function fetchAndPublish() {
  try {
    // Primero, realiza una solicitud GET para obtener la información necesaria
    const getInfoResponse = await axios.get(`${process.env.APP_URL}/pre-validate-bet`);
    console.log('Información obtenida con éxito:', getInfoResponse.data);

    // Verifica si getInfoResponse.data contiene algún elemento
    if (getInfoResponse.data.length > 0) {
      // Selecciona el primer objeto del array
      const firstObject = getInfoResponse.data[0];
      // Convierte el primer objeto a un string JSON
      const messageString = JSON.stringify(firstObject);

      // Publica el mensaje a MQTT y luego realiza la solicitud POST
      client.publish('fixtures/requests', messageString, {}, async (err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log('Message published to fixtures/requests');
          console.log('Bet placed successfully:', messageString);
        }
      });
    } else {
      console.log('No hay datos para enviar.');
    }
    
    setTimeout(fetchAndPublish, 120000); // Espera 2 minutos antes de ejecutar de nuevo
  } catch (getError) {
    console.error('Error obteniendo información:', getError);
    setTimeout(fetchAndPublish, 120000); // Espera 2 minutos antes de intentar de nuevo
  }
}

fetchAndPublish();