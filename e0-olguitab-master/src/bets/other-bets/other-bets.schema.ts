import { Schema, Document } from "mongoose";

// schema solo para guardar las requests de otros grupos y actualizar available bonds
export const OtherBetSchema = new Schema({
    request_id: String,
    group_id: String,
    fixture_id: Number,
    league_name: String,
    round: String,
    date: String,
    result: String,
    deposit_token: String,
    datetime: String,
    quantity: Number,
    seller: Number,
    status: { 
        type: String, 
        enum: ["Pending", "Validated", "Rejected", "Won", "Lost"], 
        default: "Pending" 
      }
});

export interface OtherBet extends Document {
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
    status: string;
}