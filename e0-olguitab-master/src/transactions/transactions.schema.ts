import { Schema, Document } from 'mongoose';

export const TransactionSchema = new Schema({
    id: { type: String, required: true, unique: true },
    token: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    betId: { type: String, ref: 'Bet', required: false },  // Referencia opcional al modelo Bet
    walletId: { type: String, ref: 'Wallet', required: false }, // Referencia opcional al modelo Wallet
    });

export interface Transaction extends Document {
    id: string;
    token: string;
    amount: number;
    status: string;
    betId?: string;
    walletId?: string;
}
