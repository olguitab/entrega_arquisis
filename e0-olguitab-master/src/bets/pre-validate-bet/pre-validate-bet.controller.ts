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
  async findAll(): Promise<Partial<PreValidateBet>[]> {
    const results = await this.preValidateBetService.findAll();
    return results.map(result => ({
      request_id: result.request_id,
      group_id: result.group_id,
      fixture_id: result.fixture_id,
      league_name: result.league_name,
      round: result.round,
      date: result.date,
      result: result.result,
      deposit_token: result.deposit_token,
      datetime: result.datetime,
      quantity: result.quantity,
      seller: result.seller,
    }));
  }

  // Agrega aquí más métodos según sea necesario
}