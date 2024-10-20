import { Schema, Document } from 'mongoose';

// Definir el esquema de AvailableBondsByFixture
export const AvailableBondsByFixtureSchema = new Schema({
  fixtureId: { type: Number, required: true },  // Referencia a fixture.id
  availableBonds: { type: Number, default: 40, required: true }  // Default 40
});

// Interface para que sea compatible con TypeScript y Document de Mongoose
export interface AvailableBondsByFixture extends Document {
  fixtureId: number;
  availableBonds: number;
}
