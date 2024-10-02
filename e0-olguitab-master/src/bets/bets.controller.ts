// src/bet/bet.controller.ts
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BetService } from './bets.service';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface';

@Controller('api/bet')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Get()
  findAll(): Promise<Bet[]> {
    return this.betService.findAll();
  }


}