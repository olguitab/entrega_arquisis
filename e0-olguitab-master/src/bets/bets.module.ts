import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BetSchema } from './bet.schema';
import { BetService } from './bets.service';
import { BetController } from './bets.controller';
import { MqttModule } from '../mqtt/mqtt.module';
import { AvailableBondsByFixtureModule } from '../available-bonds/available-bonds-by-fixture.module';
import { WalletModule } from 'wallet/wallet.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bet', schema: BetSchema }]),
    MqttModule,
    AvailableBondsByFixtureModule,
    WalletModule,
  ],
  providers: [BetService],
  controllers: [BetController],
  exports: [BetService],
})
export class BetModule {}