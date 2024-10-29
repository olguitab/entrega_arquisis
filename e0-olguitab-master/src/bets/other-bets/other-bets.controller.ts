import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtherBetsService } from './other-bets.service';
import { CreateOtherBetDto } from './dto/create-other-bet.dto';
import { UpdateOtherBetDto } from './dto/update-other-bet.dto';

@Controller('other-bets')
export class OtherBetsController {
  constructor(private readonly otherBetsService: OtherBetsService) {}


}
