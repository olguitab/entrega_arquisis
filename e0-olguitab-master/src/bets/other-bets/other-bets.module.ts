import { Module } from '@nestjs/common';
import { OtherBetsService } from './other-bets.service';
import { OtherBetsController } from './other-bets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtherBetSchema } from './other-bets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OtherBet', schema: OtherBetSchema }]),
  ],
  providers: [OtherBetsService],
  controllers: [OtherBetsController],
  exports: [OtherBetsService]
})
export class OtherBetsModule {}
