import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JsonWebKeyInput } from 'node:crypto';

@Injectable()
export class MqttService {
    private mqttServiceUrl = process.env.MQTT_SERVICE_URL || 'http://mqtt-service:3000/publish';

    async publishToMqtt(message: string): Promise<void> {
        try {
            console.log("mqtt-service triggered successfully")
            const response = await axios.post(this.mqttServiceUrl, { message });
        } catch (error) {
            console.error('Error triggering mqtt-service:', error.message);
        }
    }
}
