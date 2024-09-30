// pre-validate-bet.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PreValidateBetService } from './pre-validate-bet.service';
import { PreValidateBet } from './pre-validate-bet.interface';
import { Get } from '@nestjs/common';

@Controller('pre-validate-bet')
export class PreValidateBetController {
  constructor(private readonly preValidateBetService: PreValidateBetService) {}

  @Post()
  async create(@Body() createPreValidateBetDto: PreValidateBet) {
    return this.preValidateBetService.create(createPreValidateBetDto);
  }
  @Get()
  findAll(): Promise<PreValidateBet[]> {
    return this.preValidateBetService.findAll();
  }

  // Agrega aquí más métodos según sea necesario
}