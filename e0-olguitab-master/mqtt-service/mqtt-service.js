const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

let readyToProcessRequests = false;

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
      setTimeout(() => {
        readyToProcessRequests = true;
      }, 10000); // Espera 10 segundos antes de empezar a procesar mensajes

    }
  });
});


// Mensajes
client.on('message', async (topic, message) => {
  // Ignora los mensajes si el sistema no está listo para procesar solicitudes
  if (!readyToProcessRequests && topic === 'fixtures/requests') {
    console.log('Skipping message as system is not ready to process requests.');
    return;
  }
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
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/info, sending to app...');
      //console.log('string json:', message.toString());

      await axios.post(`${process.env.APP_URL}/fixtures/process`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  } else if (topic === 'fixtures/requests') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/info, sending to app...');
      //console.log('string json:', message.toString());

      await axios.post(`${process.env.APP_URL}/fixtures/requests`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }
  
  
  
  
  else if (topic === 'fixtures/history') {
    // Procesar mensajes de fixtures/history como antes
    // ver si se puede reutilizar código en el fixture.controller/service y ver cómo se podrían guardar 
        // de forma distinta los datos de history y de info (presente/futuro), se manda el topic así que se podría filtrar

        // quizás usar lo mismo, solo actualizar lo de la base de datos, para que se vean los cambios en los partidos previos
        // solo habría que filtrar bien en el front, para que no se vean los pasados, pero lo que si, usar los id de los partidos
        // de history para revisar las apuestas que se hicieron en esos partidos, y actualizar bonos comprados.

        // es decir, buscar en bonos comprados todos los ids de los matches y actualizar y entregar dinero
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/history, sending to app...');

      await axios.patch(`${process.env.APP_URL}/fixtures/history`, {
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
    const getInfoResponse = await axios.get(`${process.env.APP_URL}/pre-validate-bet`);
    console.log('Información obtenida con éxito:', getInfoResponse.data);

    const messageString = JSON.stringify(getInfoResponse.data);

    // Publica el mensaje a MQTT y luego realiza la solicitud POST
    client.publish('fixtures/request', messageString, {}, async (err) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log('Message published to fixtures/request');
        try {
          // Realiza la solicitud POST con los detalles de la apuesta
          console.log('Bet placed successfully:', messageString);
        } catch (postError) {
          console.error('Error placing bet:', postError);
        }
      }
    });
    setTimeout(fetchAndPublish, 120000);
  } catch (getError) {
    console.error('Error obteniendo información:', getError);
    setTimeout(fetchAndPublish, 120000);
  }

}


fetchAndPublish() 