// schemas/pre-validate-bet.schema.ts
import * as mongoose from 'mongoose';

export const ValidateBetSchema = new mongoose.Schema({
  request_id: { type: String, required: true },
  group_id: String,
  seller: { type: Number, default: 0 },
  valid: Boolean,
});