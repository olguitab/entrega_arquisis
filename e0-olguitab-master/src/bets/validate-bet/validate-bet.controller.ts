// pre-validate-bet.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ValidateBetService } from './validate-bet.service';
import { ValidateBet } from './validate-bet.interface';
import { Get } from '@nestjs/common';

@Controller('validate-bet')
export class ValidateBetController {
  constructor(private readonly ValidateBetService: ValidateBetService) {}

  @Post()
  async create(@Body() createValidateBetDto: ValidateBet) {
    return this.ValidateBetService.create(createValidateBetDto);
  }
  @Get()
  findAll(): Promise<ValidateBet[]> {
    return this.ValidateBetService.findAll();
  }

  // Agrega aquí más métodos según sea necesario
}