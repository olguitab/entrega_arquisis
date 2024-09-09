import { FixtureService } from './fixtures.service';
export declare class FixturesController {
    private readonly fixtureService;
    constructor(fixtureService: FixtureService);
    processFixtures(requestBody: any): Promise<any>;
    getFixtureById(id: string): Promise<any>;
    getAllFixtures(page: string, count: string, home: string, away: string, visit: string, date: string): Promise<any>;
}
