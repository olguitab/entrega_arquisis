// interfaces/pre-validate-bet.interface.ts
import { Document } from 'mongoose';

export interface PreValidateBet extends Document {
  id_usuario: number;
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