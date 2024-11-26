import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { Auction, AuctionSchema } from './auction.schema';
import { User, UserSchema } from 'user/user.schema';
import { BetModule } from 'bets/bets.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Auction', schema: AuctionSchema },
      { name: User.name, schema: UserSchema }

    ]),
    BetModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService], 
})
export class AuctionModule {}