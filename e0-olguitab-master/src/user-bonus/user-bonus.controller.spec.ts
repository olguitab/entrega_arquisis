import { Test, TestingModule } from '@nestjs/testing';
import { UserBonusController } from './user-bonus.controller';
import { UserBonusService } from './user-bonus.service';

describe('UserBonusController', () => {
  let controller: UserBonusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBonusController],
      providers: [UserBonusService],
    }).compile();

    controller = module.get<UserBonusController>(UserBonusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
