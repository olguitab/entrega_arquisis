import { Module } from '@nestjs/common';
import { BrokerBonusService } from './broker-bonus.service';
import { BrokerBonusController } from './broker-bonus.controller';

@Module({
  controllers: [BrokerBonusController],
  providers: [BrokerBonusService],
})
export class BrokerBonusModule {}
