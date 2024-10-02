import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const ValidateBetSchema = new mongoose.Schema({
  request_id: String,
  group_id: String,
  seller: Number,
  valid: Boolean,
  user_id: Types.ObjectId,
});