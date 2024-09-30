import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'user/user.schema'; 

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name , unique: true, required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  money: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
