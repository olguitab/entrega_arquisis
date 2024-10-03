import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureSchema } from './fixtures.schema';
import { FixturesController } from './fixtures.controller';
import { FixtureService } from './fixtures.service';
import { BetService } from 'bets/bets.service';
import { BetSchema } from 'bets/bet.schema';
import { BetModule } from 'bets/bets.module';
import { WalletModule } from 'wallet/wallet.module';
import { WalletService } from 'wallet/wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Fixture', schema: FixtureSchema }]),
    MongooseModule.forFeature([{ name: 'Bet', schema: BetSchema }]),
    BetModule,
    WalletModule,
  ],
  providers: [FixtureService, BetService, WalletService],
  controllers: [FixturesController],
})
export class FixturesModule {}
