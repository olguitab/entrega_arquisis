import { Module, Request } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureSchema } from './fixtures/fixtures.schema';
import { FixturesController } from './fixtures/fixtures.controller';
import { FixtureService } from './fixtures/fixtures.service';
import { InitializationService } from 'initialization/initialization.service';
import { UsersModule } from 'user/user.module';
import { BetModule } from 'bets/bets.module';
import { BetSchema } from 'bets/bet.schema';

import { FixturesModule } from 'fixtures/fixtures.module';
import { WalletModule } from 'wallet/wallet.module';
import { AvailableBondsByFixtureSchema } from 'available-bonds/available-bonds-by-fixture.schema';


import { RequestModule } from 'requests/requests.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { WebpayModule } from 'webpay/webpay.module';
import { TransactionModule } from 'transactions/transactions.module'
import { TransactionSchema } from 'transactions/transactions.schema'




@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: 'Fixture', schema: FixtureSchema }]),
    MongooseModule.forFeature([{ name: 'AvailableBondsByFixture', schema: AvailableBondsByFixtureSchema }]),
    MongooseModule.forFeature([{ name: 'Bet', schema: BetSchema }]),
    MongooseModule.forFeature([{ name: 'Transaction', schema: TransactionSchema }]),
    UsersModule,
    BetModule,
    FixturesModule,
    WalletModule,
    RequestModule,  
    WebpayModule,
    TransactionModule,
  ],
  controllers: [FixturesController, AppController ],
  providers: [FixtureService, InitializationService, AppService],
})
export class AppModule {}

