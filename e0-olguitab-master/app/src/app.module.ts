import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureSchema } from './fixtures/fixtures.schema';
import { FixturesController } from './fixtures/fixtures.controller';
import { FixtureService } from './fixtures/fixtures.service';
import { MqttService } from './mqtt/mqtt.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/e0bd'), // Adjust the connection string
    MongooseModule.forFeature([{ name: 'Fixture', schema: FixtureSchema }]),
  ],
  controllers: [FixturesController],
  providers: [FixtureService,MqttService],
})
export class AppModule {}
