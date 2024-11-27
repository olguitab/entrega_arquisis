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

  // -- fixtures/auctions --
  client.subscribe('fixtures/auctions', (err) => {
    if (err) {
      console.error('Subscription error (fixtures/auctions):', err);
    } else {
      console.log('Subscribed to topic: fixtures/auctions');
    }
  });
});


// ----- MESSAGES: HANDLE POSTS -----
client.on('message', async (topic, message) => {

  //  -- fixtures/validation --
  if (topic === 'fixtures/validation') {
    try {
      const data = JSON.parse(message.toString());
      console.log('Receiving validation...');
      console.log('Validation message:\n', message.toString());

      const response = await axios.post(`${process.env.APP_URL}/requests/validation`, data);
    } catch (error) {
      console.error('Error processing MQTT message VALIDATION:', error);
    }

    // -- fixtures/info --
  } else if (topic === 'fixtures/info') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received fixtures/info message, sending to app...');
      // console.log('Info message:\n', message.toString());
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

      // se está procesando acá dentro del process request el decremento de los bonos
      await axios.post(`${process.env.APP_URL}/requests/process`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message REQUEST:', error);
    }
  }

  // -- fixtures/history --
  else if (topic === 'fixtures/history') {
    try {
      const parsedMessage = JSON.parse(JSON.parse(message.toString()));
      console.log('Received message on fixtures/history, sending to app...');
      // console.log('History message:\n', message.toString());

      await axios.patch(`${process.env.APP_URL}/fixtures/history`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message HISTORY:', error);
    }
  }

  // -- fixtures/auctions --
  else if (topic === 'fixtures/auctions') {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log('Received message on fixtures/auctions, sending to app...');
      // console.log('Auctions message:\n', message.toString());

      // verificar/cambiar endpoint
      await axios.post(`${process.env.APP_URL}/auctions/manage-message`, {
        topic,
        message: parsedMessage,
      });
    } catch (error) {
      console.error('Error processing MQTT message AUCTIONS:', error);
    }
  }
});


// ----- PUBLISHING: POSTING ON REQUESTS -----
app.post('/publish/requests', (req, res) => {
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

// ----- PUBLISHING: POSTING ON VALIDATION -----
app.post('/publish/validation', (req, res) => {
  const { message } = req.body;
  console.log("Publishing on validation channel, triggered by transaction commit")
  client.publish('fixtures/validation', message, (err) => {
    if (err) {
      console.error('Error publishing on MQTT', err);
      return res.status(500).json({ message: 'Error publishing on MQTT' });
    }
    console.log(`Message published on validation:': ${message}`);
    return res.status(200).json({ message: 'Published successfully on MQTT' });
  });
});

// ----- PUBLISHING: POSTING ON AUCTIONS -----
app.post('/publish/auctions', (req, res) => {
  const { message } = req.body;
  console.log("Publishing on auctions channel, triggered by a new auction ")
  client.publish('fixtures/auctions', message, (err) => {
    if (err) {
      console.error('Error publishing on MQTT', err);
      return res.status(500).json({ message: 'Error publishing on MQTT' });
    }
    console.log(`Message published on auctions:': ${message}`);
    return res.status(200).json({ message: 'Published successfully on MQTT' });
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`MQTT Service listening on port ${PORT}`);
});

