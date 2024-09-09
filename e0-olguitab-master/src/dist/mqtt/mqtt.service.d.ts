import { Model } from 'mongoose';
import { Fixture } from '../fixtures/fixtures.schema';
export declare class MqttService {
    private readonly fixtureModel;
    private client;
    constructor(fixtureModel: Model<Fixture>);
}
