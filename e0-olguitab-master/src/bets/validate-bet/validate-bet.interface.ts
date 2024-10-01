// interfaces/pre-validate-bet.interface.ts
import { Document } from 'mongoose';

export interface ValidateBet extends Document {
  request_id: string;
  group_id: string;
  seller: number;
  valid: boolean;
}