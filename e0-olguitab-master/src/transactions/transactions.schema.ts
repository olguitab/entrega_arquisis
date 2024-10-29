import { Schema, Document } from 'mongoose';

export const TransactionSchema = new Schema({
    token: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    betId: { type: String, ref: 'Bet', required: false },
    walletId: { type: String, ref: 'Wallet', required: false },
    });

export interface Transaction extends Document {
    token: string;
    amount: number;
    status: string;
    betId?: string;
    walletId?: string;
}
