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
  client.subscribe('fixtures/history', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/history):', err);
    } else {
      console.log('Subscribed to topic: fixtures/history');
    }
  });
});


// Mensajes
client.on('message', async (topic, message) => {
  try {
    const parsedMessage = JSON.parse(JSON.parse(message.toString()));
    console.log(`Received message on topic ${topic}, sending to app...`);

    // Para distintos canales, quizás se puede reducir código duplicado haciendo una cadena de texto 
    // con el endpoint y luego hacer la petición axios (ahora no cumple porque se está usando process en vez de info)
    switch (topic) {
      case 'fixtures/info':
        await axios.post(`${process.env.APP_URL}/fixtures/process`, {
          topic,
          message: parsedMessage,
        });
        break;
      
        // ver si se puede reutilizar código en el fixture.controller/service y ver cómo se podrían guardar 
        // de forma distinta los datos de history y de info (presente/futuro), se manda el topic así que se podría filtrar

        // quizás usar lo mismo, solo actualizar lo de la base de datos, para que se vean los cambios en los partidos previos
        // solo habría que filtrar bien en el front, para que no se vean los pasados, pero lo que si, usar los id de los partidos
        // de history para revisar las apuestas que se hicieron en esos partidos, y actualizar bonos comprados.

        // es decir, buscar en bonos comprados todos los ids de los matches y actualizar y entregar dinero
      case 'fixtures/history':
        
        await axios.post(`${process.env.APP_URL}/fixtures/history`, {
          topic,
          message: parsedMessage,
        });
        
       // imprimir json parseado pero de vuelta a string con 2 parseos
       //console.log('History fixtures:',message.toString());
        break;

      default:
        console.warn(`Unhandled topic: ${topic}`);
    }
  } catch (error) {
    console.error(`Error processing MQTT message on topic ${topic}:`, error);
  }
});