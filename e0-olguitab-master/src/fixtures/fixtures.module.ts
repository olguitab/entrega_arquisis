import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureSchema } from './fixtures.schema';
import { FixturesController } from './fixtures.controller';
import { FixtureService } from './fixtures.service';
import { MqttModule } from 'mqtt/mqtt.module';
import { BetService } from 'bets/bets.service';
import { BetSchema } from 'bets/bet.schema';
import { BetModule } from 'bets/bets.module';
import { AvailableBondsByFixtureSchema } from '../available-bonds/available-bonds-by-fixture.schema'; 
import { AvailableBondsByFixtureModule } from '../available-bonds/available-bonds-by-fixture.module'; 


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Fixture', schema: FixtureSchema }]),
    MongooseModule.forFeature([{ name: 'Bet', schema: BetSchema }]),
    MongooseModule.forFeature([{ name: 'AvailableBondsByFixture', schema: AvailableBondsByFixtureSchema }]),
    AvailableBondsByFixtureModule,
    MqttModule
  ],
  providers: [FixtureService, BetService],
  controllers: [FixturesController],
})
export class FixturesModule {}
