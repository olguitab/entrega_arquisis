// pre-validate-bet.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreValidateBetController } from './pre-validate-bet.controller';
import { PreValidateBetService } from './pre-validate-bet.service';
import { PreValidateBetSchema } from './pre-validate-bet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PreValidateBet', schema: PreValidateBetSchema }]),
  ],
  controllers: [PreValidateBetController],
  providers: [PreValidateBetService],
  exports: [PreValidateBetService, MongooseModule, PreValidateBetModule],
})
export class PreValidateBetModule {}