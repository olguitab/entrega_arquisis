// create-bet.dto.ts
export class CreateBetDto {
    readonly request_id: string;
    readonly group_id: string;
    readonly fixture_id: number;
    readonly league_name: string;
    readonly round: string;
    readonly date: string;
    readonly result: string;
    readonly deposit_token: string;
    readonly datetime: string;
    readonly quantity: number;
    readonly seller: number;
  }