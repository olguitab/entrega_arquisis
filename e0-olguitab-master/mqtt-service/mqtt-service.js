const mqtt = require('mqtt');
const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

  // ----- CONNECTION: SUSCRIBE TO TOPICS -----
client.on('connect', () => {
  console.log('Connected to MQTT Broker');

  // -- fixtures/info --
  client.subscribe('fixtures/info', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/info');
    }
  });
  // -- fixtures/validation --
  client.subscribe('fixtures/validation', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topics: fixtures/validation');
    }
  });
  // -- fixtures/history --
  client.subscribe('fixtures/history', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/history):', err);
    } else {
      console.log('Subscribed to topic: fixtures/history');

    }
  });
  // -- fixtures/requests --
  client.subscribe('fixtures/requests', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/requests):', err);
    } else {
      console.log('Subscribed to topic: fixtures/requests');
    }
  });
});


// ----- MESSAGES: HANDLE POSTS -----
client.on('message', async (topic, message) => {

  //  -- fixtures/validation --
  // Si es false y es de nuestro grupo debemos devolver la plata
  // Si es de nuestro grupo debemos cambiar el estado de la bet/bond
  // en resumen: update a wallet si es de nuestro grupo y false
  //             & update de estado del bono
  if (topic === 'fixtures/validation') {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log('Receiving validation...');
      console.log('Validation message:\n', message.toString());

      const fixtureId = parsedMessage.fixture_id;
      const quantity = parsedMessage.quantity;
      const validation = parsedMessage.validation;
      console.log(`Fixture id associated to bond validation: ${fixtureId}`);

      // Verificar que se recibieron los parámetros requeridos
      if (!fixtureId || !quantity || validation === undefined) {
        throw new Error('fixture_id, quantity o validation no proporcionado en el mensaje');
      }

      // Hacer una solicitud HTTP a la API para procesar la validación
      const response = await axios.post(`${process.env.APP_URL}/available-bonds/validation`, {
        fixtureId,
        quantity,
        validation
      });

    } catch (error) {
      console.error('Error processing MQTT message VALIDATION:', error);
    }

    // -- fixtures/info --
  } else if (topic === 'fixtures/info') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message, sending to app...');
      await axios.post(`${process.env.APP_URL}/fixtures/process`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message INFO:', error);

    // -- fixtures/requests --
    }} else if (topic === 'fixtures/requests') {
    try {
      const parsedMessage = JSON.parse(message.toString())
      console.log('Received message on fixtures/request, sending to app...');
      console.log('Received request string JSON:', JSON.parse(message.toString()));

      const fixtureId = parsedMessage.fixture_id;
      const quantity = parsedMessage.quantity;
      console.log(`Fixture id associated to bond request: ${fixtureId}`);

      await axios.post(`${process.env.APP_URL}/available-bonds/${fixtureId}/decrement/${quantity}`);
    } catch (error) {
      console.error('Error processing MQTT message REQUEST:', error);
    }
  }

  // -- fixtures/history --
  else if (topic === 'fixtures/history') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/history, sending to app...');
      console.log('History message:\n', message.toString());

      await axios.patch(`${process.env.APP_URL}/fixtures/history`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message HISTORY:', error);
    }
  }
});


// ----- PUBLISHING: POSTING ON REQUESTS -----
app.post('/publish', (req, res) => {
  const { message } = req.body;
  console.log("Publishing on requests channel, triggered by a bond creation ")
  client.publish('fixtures/requests', message, (err) => {
    if (err) {
      console.error('Error publishing on MQTT', err);
      return res.status(500).json({ message: 'Error publishing on MQTT' });
    }
    console.log(`Message published on request:': ${message}`);
    return res.status(200).json({ message: 'Published successfully on MQTT' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MQTT Service listening on port ${PORT}`);
});

// async function fetchAndPublish() {
//   try {
//     // Primero, realiza una solicitud GET para obtener la información necesaria
//     const getInfoResponse = await axios.get(`${process.env.APP_URL}/pre-validate-bet`);
//     console.log('Información obtenida con éxito:', getInfoResponse.data);

//     // Verifica si getInfoResponse.data contiene algún elemento
//     if (getInfoResponse.data.length > 0) {
//       // Selecciona el primer objeto del array
//       const firstObject = getInfoResponse.data[0];
//       // Convierte el primer objeto a un string JSON
//       const messageString = JSON.stringify(firstObject);

//       // Publica el mensaje a MQTT y luego realiza la solicitud POST
//       client.publish('fixtures/requests', messageString, {}, async (err) => {
//         if (err) {
//           console.error('Error publishing message:', err);
//         } else {
//           console.log('Message published to fixtures/requests');
//           console.log('Bet placed successfully:', messageString);
//         }
//       });
//     } else {
//       console.log('No hay datos para enviar.');
//     }
    
//     setTimeout(fetchAndPublish, 120000); // Espera 2 minutos antes de ejecutar de nuevo
//   } catch (getError) {
//     console.error('Error obteniendo información:', getError);
//     setTimeout(fetchAndPublish, 120000); // Espera 2 minutos antes de intentar de nuevo
//   }
// }

//fetchAndPublish();

