import { Module, Req } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './requests.schema';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

// necesito importar modulos de bets, y other bets
import { BetModule } from 'bets/bets.module';
import { OtherBetsModule } from 'bets/other-bets/other-bets.module';

import { AvailableBondsByFixtureModule } from 'available-bonds/available-bonds-by-fixture.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    BetModule,
    OtherBetsModule,
    AvailableBondsByFixtureModule,
  ],
  providers: [RequestsService],
  controllers: [RequestsController],
  
})
export class RequestModule {}