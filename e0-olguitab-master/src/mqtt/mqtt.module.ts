import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Module({
  providers: [MqttService],
  exports: [MqttService],  // Exportamos MqttService para que otros módulos lo usen
})
export class MqttModule {}
