import * as mongoose from 'mongoose';
import { User } from 'user/user.schema';


export const ValidateBetSchema = new mongoose.Schema({
  request_id: String,
  group_id: String,
  seller: Number,
  valid: Boolean,
  user_id: User,
});