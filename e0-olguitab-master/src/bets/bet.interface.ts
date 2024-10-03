// bet.interface.ts o en la parte superior de tu archivo de servicio
interface Bet {
  id_usuario: string;
    id?: string; // Opcional porque MongoDB lo añade automáticamente
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
    ipAddress?: string; // Dirección IP del usuario
    country?: string;  // País obtenido de la IP
    city?: string;
    //checked_result?: boolean; // Si el bet ha sido verificado, true si se revisa y se realizan pagos
    status?: string; // estado del bet: 'pending', 'won', 'lost'
  }

  export default Bet;