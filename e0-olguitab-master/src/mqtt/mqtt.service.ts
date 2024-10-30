import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JsonWebKeyInput } from 'node:crypto';

@Injectable()
export class MqttService {
    private mqttServiceUrl = process.env.MQTT_SERVICE_URL || 'http://mqtt-service:3003';

    async publishToMqttRequests(message: string): Promise<void> {
        try {
            const response = await axios.post(`${this.mqttServiceUrl}/publish/requests`, { message });
            console.log("Publish message on mqtt-service/requests triggered successfully")
        } catch (error) {
            console.error('Error triggering mqtt-service:', error.message);
        }
    }

    async publishToMqttValidation(message: string): Promise<void> {
        try {
            const response = await axios.post(`${this.mqttServiceUrl}/publish/validation`, { message });
            console.log("Publish message on mqtt-service/validation triggered successfully")
        } catch (error) {
            console.error('Error triggering mqtt-service:', error.message);
        }
    }
}
