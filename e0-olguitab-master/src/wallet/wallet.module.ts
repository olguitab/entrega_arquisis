import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './wallet.schema';
import { User, UserSchema } from 'user/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema }

    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService], 
})
export class WalletModule {}
