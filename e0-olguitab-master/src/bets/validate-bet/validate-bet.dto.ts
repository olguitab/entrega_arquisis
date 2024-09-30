// pre-validate-bet.dto.ts
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ValidateBetDto {
  @IsUUID()
  request_id: string;

  @IsString()
  @IsNotEmpty()
  group_id: string;


  @IsBoolean()
  valid: string;

  @IsNumber()
  seller: number;
}