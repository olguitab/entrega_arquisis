import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixtureSchema } from './fixtures/fixtures.schema';
import { FixturesController } from './fixtures/fixtures.controller';
import { FixtureService } from './fixtures/fixtures.service';
import { InitializationService } from 'initialization/initialization.service';
import { UsersModule } from 'user/user.module';
import { BetModule } from 'bets/bets.module';
import { FixturesModule } from 'fixtures/fixtures.module';
import { BetSchema } from 'bets/bet.schema';
import { PreValidateBetModule } from 'bets/pre-validate-bet/pre-validate-bet.module';
import { ValidateBetModule } from 'bets/validate-bet/validate-bet.module';
import { WalletModule } from 'wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: 'Fixture', schema: FixtureSchema }]),
    UsersModule,
    BetModule,
    FixturesModule,
    PreValidateBetModule,
    ValidateBetModule,
    WalletModule,
  ],
  controllers: [FixturesController],
  providers: [FixtureService, InitializationService],
})
export class AppModule {}
