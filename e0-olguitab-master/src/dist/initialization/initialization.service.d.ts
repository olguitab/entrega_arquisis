import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Fixture } from 'fixtures/fixtures.schema';
export declare class InitializationService implements OnModuleInit {
    private fixtureModel;
    constructor(fixtureModel: Model<Fixture>);
    onModuleInit(): Promise<void>;
    cleanFixtures(): Promise<void>;
}
