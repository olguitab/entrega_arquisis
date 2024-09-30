// pre-validate-bet.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class PreValidateBetDto {
  @IsUUID()
  request_id: string;

  @IsString()
  @IsNotEmpty()
  group_id: string;

  @IsNumber()
  fixture_id: number;

  @IsString()
  league_name: string;

  @IsString()
  round: string;

  @IsString()
  date: string; // Asumiendo que recibirás la fecha como string

  @IsString()
  result: string;

  @IsString()
  deposit_token: string;

  @IsString()
  datetime: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  seller: number;
}