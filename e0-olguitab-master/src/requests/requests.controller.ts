// src/requests/requests.controller.ts
import { Body, Controller, Post, HttpStatus, HttpException, Get, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { OtherBetsService } from '../bets/other-bets/other-bets.service';

import { AvailableBondsByFixtureService } from 'available-bonds/available-bonds-by-fixture.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('requests')

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService,
              private readonly otherBetsService: OtherBetsService,
              private readonly availableBondsByFixtureService: AvailableBondsByFixtureService
  ) {}

  @Post('process')
  async processRequest(@Body() requestBody: any): Promise<any> {
    try {
      const request = requestBody.message;

      const { wallet, ...createOtherBet } = request;

      // procesar si es nuestra apuesta o de otro grupo en request service llamando otherBetsService
      if (request.group_id !== 23) {
        // es otra apuesta
        this.otherBetsService.createOtherBet(createOtherBet);
      }

      // luego disminuir los bonos disponibles en availableBondsByFixtureService
      const fixtureId = request.fixture_id;
      const quantity = Number(request.quantity);
      
      await this.availableBondsByFixtureService.decrementAvailableBonds(fixtureId, quantity);

    } catch (error) {
      console.error('Error REQUEST', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('validation')
  async validateRequest(@Body() requestBody: any): Promise<any> {
    // acá hacer todo lo que se necesita para procesar la respuesta de la validación
    console.log('Received validation request:', requestBody);

    await this.requestsService.updateRequestValidation(requestBody);
  }
  
};