import { Schema, Document } from 'mongoose';
import Transaction from 'transbank-sdk/dist/es5/transbank/webpay/webpay_plus/transaction';

export const BetSchema = new Schema({
  id_usuario: String,
  request_id: String,
  group_id: String,
  fixture_id: Number,
  league_name: String,
  round: String,
  date: String,
  result: String,
  deposit_token: { type: String, default: '' }, // Si el depósito puede ser opcional, puedes establecer un valor predeterminado
  datetime: String,
  quantity: Number,
  seller: Number,
  ipAddress: String, // Dirección IP del usuario
  country: String, // País obtenido de la IP
  city: String,
  status: { 
    type: String, 
    enum: ["Pending", "Validated", "Rejected", "Won", "Lost"], 
    default: "Pending" 
  },
  wallet: Boolean,
});

export interface Bet extends Document {
  id_usuario: string;
  request_id: string;
  group_id: string;
  fixture_id: number;
  league_name: string;
  round: string;
  date: string;
  result: string;
  deposit_token?: string;
  datetime: string;
  quantity: number;
  seller: number;
  ipAddress: string;
  country: string;
  city: string;
  //status: 'Pending' | 'Validated' | 'Rejected' | 'Won' | 'Lost';
  status: string; // Cambia el tipo de enumeración a string
  wallet: boolean;
  //transaction: Transaction;
}
