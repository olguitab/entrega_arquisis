import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ValidateBetDto {
  @IsUUID()
  request_id: string;

  @IsString()
  @IsNotEmpty()
  group_id: string;

  @IsNumber()
  seller: number;

  @IsBoolean()
  valid: string;

}