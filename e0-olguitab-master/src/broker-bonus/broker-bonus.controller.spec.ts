import { Test, TestingModule } from '@nestjs/testing';
import { BrokerBonusController } from './broker-bonus.controller';
import { BrokerBonusService } from './broker-bonus.service';

describe('BrokerBonusController', () => {
  let controller: BrokerBonusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerBonusController],
      providers: [BrokerBonusService],
    }).compile();

    controller = module.get<BrokerBonusController>(BrokerBonusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
