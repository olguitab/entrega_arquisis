
import { Module } from '@nestjs/common';
import { ValidateBetSchema } from './validate-bet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateBetController } from './validate-bet.controller';
import { ValidateBetService } from './validate-bet.service';
import { PreValidateBetService } from 'bets/pre-validate-bet/pre-validate-bet.service';
import { PreValidateBetModule } from 'bets/pre-validate-bet/pre-validate-bet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ValidateBet', schema: ValidateBetSchema }]),
    PreValidateBetModule,
  ],
  controllers: [ValidateBetController],
  providers: [ValidateBetService],
  exports: [ValidateBetService, MongooseModule, ValidateBetModule],
})
export class ValidateBetModule {}