import { Schema, Document } from 'mongoose';

export const AdminBonds = new Schema({
  fixtureId: { type: Number, required: true }, 
  availableBonds: { type: Number, default: 0, required: true }  
});

export interface AdminBonds extends Document {
  fixtureId: number;
  availableBonds: number;
}
