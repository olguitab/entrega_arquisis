import { Test, TestingModule } from '@nestjs/testing';
import { BrokerBonusService } from './broker-bonus.service';

describe('BrokerBonusService', () => {
  let service: BrokerBonusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrokerBonusService],
    }).compile();

    service = module.get<BrokerBonusService>(BrokerBonusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
