
import { Module } from '@nestjs/common';
import { ValidateBetSchema } from './validate-bet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateBetController } from './validate-bet.controller';
import { ValidateBetService } from './validate-bet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ValidateBet', schema: ValidateBetSchema }]),
  ],
  controllers: [ValidateBetController],
  providers: [ValidateBetService],
  exports: [ValidateBetService, MongooseModule, ValidateBetModule],
})
export class ValidateBetModule {}