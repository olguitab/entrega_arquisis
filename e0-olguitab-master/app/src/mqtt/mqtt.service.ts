import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Fixture } from 'src/fixtures/fixtures.schema';

@Injectable()
export class MqttService {
  private client: mqtt.MqttClient;

  constructor(@InjectModel('Fixture') private readonly fixtureModel: Model<Fixture>) {
    this.client = mqtt.connect('mqtt://broker.iic2173.org:9000', {
      username: 'students',
      password: 'iic2173-2024-2-students',
    });

    this.client.on('connect', () => {
      console.log('Conexión exitosa al broker MQTT');
      this.client.subscribe('fixtures/info', (err) => {
        if (err) {
          console.error('Error en la suscripción:', err);
        } else {
          console.log('Suscripción exitosa a fixtures/info');
        }
      });
    });

    this.client.on('error', (err) => {
      console.error('Error en la conexión MQTT:', err);
    });

    this.client.on('message', async (topic, message) => {
      try {
        const doubleParsedMessage = JSON.parse(JSON.parse(message.toString()));
        console.log('Sending double parsed message to controller...');

        // Enviar el mensaje al controlador para su procesamiento
        await axios.post('http://localhost:3000/fixtures/process', {
          topic: topic,
          message: doubleParsedMessage,
        });
      } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
      }
    });
  }
}

