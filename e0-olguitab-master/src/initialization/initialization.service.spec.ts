import { Test, TestingModule } from '@nestjs/testing';
import { InitializationService } from './initialization.service';

describe('InitializationService', () => {
  let service: InitializationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializationService],
    }).compile();

    service = module.get<InitializationService>(InitializationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
