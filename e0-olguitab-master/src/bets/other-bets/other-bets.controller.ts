import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtherBetsService } from './other-bets.service';
import { CreateOtherBetDto } from './dto/create-other-bet.dto';
import { UpdateOtherBetDto } from './dto/update-other-bet.dto';

@Controller('other-bets')
export class OtherBetsController {
  constructor(private readonly otherBetsService: OtherBetsService) {}

  @Post()
  create(@Body() createOtherBetDto: CreateOtherBetDto) {
    return this.otherBetsService.create(createOtherBetDto);
  }

  @Get()
  findAll() {
    return this.otherBetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherBetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtherBetDto: UpdateOtherBetDto) {
    return this.otherBetsService.update(+id, updateOtherBetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherBetsService.remove(+id);
  }
}
