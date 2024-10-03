import * as mongoose from 'mongoose';

export const BetSchema = new mongoose.Schema({
  id_usuario: String,
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
  ipAddress: String, // Dirección IP del usuario
  country: String, // País obtenido de la IP
  city: String,
  checked_result: { type: Boolean, default: false }, // Si el bet ha sido verificado, true si se revisa y se realizan pagos
});