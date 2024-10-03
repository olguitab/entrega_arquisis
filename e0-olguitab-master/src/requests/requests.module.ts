import { Module, Req } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './requests.schema';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
  ],
  providers: [RequestsService],
  controllers: [RequestsController],
  
})
export class RequestModule {}