import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import { User } from 'user/user.schema'; 

@Schema()
export class BrokerBonus extends Document {
    @Prop({ required: true })
    fixture_id: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;
}

export const BrokerBonusSchema = SchemaFactory.createForClass(BrokerBonus);
