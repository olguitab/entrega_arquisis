import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BetSchema } from './bet.schema';
import { BetService } from './bets.service';
import { BetController } from './bets.controller';
import { PreValidateBetModule } from './pre-validate-bet/pre-validate-bet.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { AvailableBondsByFixtureModule } from '../available-bonds/available-bonds-by-fixture.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bet', schema: BetSchema }]),
    MqttModule,
    AvailableBondsByFixtureModule,
  ],
  providers: [BetService],
  controllers: [BetController],
  exports: [BetService],
})
export class BetModule {}