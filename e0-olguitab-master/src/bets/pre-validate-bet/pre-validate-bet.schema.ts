// schemas/pre-validate-bet.schema.ts
import * as mongoose from 'mongoose';

export const PreValidateBetSchema = new mongoose.Schema({
  request_id: { type: String, required: true },
  group_id: String,
  fixture_id: Number,
  league_name: String,
  round: String,
  date: String,
  result: String,
  deposit_token: { type: String, default: ' ' },
  datetime: String,
  quantity: Number,
  seller: { type: Number, default: 0 },
});
