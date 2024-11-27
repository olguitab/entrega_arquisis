import { Schema, Document } from 'mongoose';

export const AuctionSchema = new Schema({
    auction_id: { type: String },
    proposal_id: { type: String },

    fixture_id: { type: Number, required: true },
    league_name: { type: String },
    round: { type: String },
    result: { type: String },

    quantity: { type: Number, required: true },
    group_id: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ["offer", "proposal", "acceptance", "rejection"], 
        required: true 
    },
}
);

export interface Auction extends Document {
    auction_id: string;
    proposal_id: string;

    fixture_id: number;
    league_name: string;
    round: string;
    result: string;

    quantity: number;
    group_id: number;
    type: string;
}
