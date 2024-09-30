import { Controller } from '@nestjs/common';
import { BrokerBonusService } from './broker-bonus.service';

@Controller('broker-bonus')
export class BrokerBonusController {
  constructor(private readonly brokerBonusService: BrokerBonusService) {}
}
