import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let appService: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
    });

    it('should intentionally fail', () => {
        expect(true).toBe(false); // Test trivial que fallará
    });
});
