import * as mongoose from 'mongoose';

export const BetSchema = new mongoose.Schema({
  request_id: String,
  group_id: String,
  fixture_id: Number,
  league_name: String,
  round: String,
  date: String,
  result: String,
  deposit_token: { type: String, default: ' ' }, // Si el depósito puede ser opcional, puedes establecer un valor predeterminado
  datetime: String,
  quantity: Number,
  seller: Number,
});
export const BetModel = mongoose.model('Bet', BetSchema);
