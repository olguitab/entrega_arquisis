// bet.interface.ts o en la parte superior de tu archivo de servicio
interface Bet {
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
  }

  export default Bet;