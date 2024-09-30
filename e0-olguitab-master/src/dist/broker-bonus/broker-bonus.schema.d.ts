import { Document } from 'mongoose';
export declare class BrokerBonus extends Document {
    fixture_id: string;
    email: string;
    password: string;
}
export declare const BrokerBonusSchema: import("mongoose").Schema<BrokerBonus, import("mongoose").Model<BrokerBonus, any, any, any, Document<unknown, any, BrokerBonus> & BrokerBonus & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BrokerBonus, Document<unknown, {}, import("mongoose").FlatRecord<BrokerBonus>> & import("mongoose").FlatRecord<BrokerBonus> & Required<{
    _id: unknown;
}>>;
