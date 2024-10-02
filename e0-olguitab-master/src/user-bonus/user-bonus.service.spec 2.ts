import { Test, TestingModule } from '@nestjs/testing';
import { UserBonusService } from './user-bonus.service';

describe('UserBonusService', () => {
  let service: UserBonusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBonusService],
    }).compile();

    service = module.get<UserBonusService>(UserBonusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
