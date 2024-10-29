import { Module } from '@nestjs/common';
import { WebpayService } from './webpay.service';
import { WebpayController } from './webpay.controller';

@Module({
  providers: [WebpayService],
  controllers: [WebpayController],
  exports: [WebpayService],
})
export class WebpayModule {}
