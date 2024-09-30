import { Model } from 'mongoose';
import { Fixture } from './fixtures.schema';
export declare class FixtureService {
    private readonly fixtureModel;
    constructor(fixtureModel: Model<Fixture>);
    createOrUpdateFixtures(fixturesData: any[]): Promise<any[]>;
    getAllFixtures(page: number, count: number, filters: any): Promise<Fixture[]>;
    getFixtureById(id: number): Promise<Fixture>;
}
