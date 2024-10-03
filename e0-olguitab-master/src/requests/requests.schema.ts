import { Schema, Document } from 'mongoose';

export const RequestSchema = new Schema({
  request_id: {
    type: String,
    allowNull: false,
    unique: true,
  },
  group_id: String,
  fixture_id: Number,
  league_name: String,
  round: String,
  date: String,
  result: String,
  deposit_token: String,
  datetime: String,
  quantity: Number,
  seller: Number,
});
export interface Request extends Document {
  request_id: string;
  group_id: string;
  fixture_id: number;
  league_name: string;
  round: string;
  date: string;
  result: string;
  deposit_token: string;
  datetime: string;
  quantity: number;
  seller: number;
}