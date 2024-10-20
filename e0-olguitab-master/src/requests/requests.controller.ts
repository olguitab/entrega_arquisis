// src/requests/requests.controller.ts
import { Body, Controller, Post, HttpStatus, HttpException, Get, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async processFixtures(@Body() requestBody: any): Promise<any> {
    try {
      console.log('Received request body:', requestBody);
  
      // Ahora, requestBody es directamente el objeto que quieres procesar
      // No necesitas extraerlo de una propiedad `message`
      if (!requestBody || typeof requestBody !== 'object') {
        console.log('Invalid data format:', requestBody);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format',
        };
      }
  
      const fixtures = requestBody; // requestBody ya es el objeto que quieres
      console.log('Processing fixtures:', fixtures);

      const savedFixtures = await this.requestsService.createOrUpdateFixtures(fixtures);
      console.log('GUARDADO REQUEST:', savedFixtures);
    } catch (error) {
      console.error('Error REQUEST', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('total-bonus-avaliable/:fixture_id')
  async getTotalBonusAvaliable(@Param('fixture_id') fixture_id: number): Promise<number> {
    const totalRequest = await this.requestsService.calculateTotalRequestsByFixtureId(fixture_id);
    const totalBonusAvailable = 40 - totalRequest;
    return totalBonusAvailable;
  }

  @Post('validation')
  async validateRequest(@Body() requestBody: any): Promise<any> {
    // acá hacer todo lo que se necesita para procesar la respuesta de la validación
    console.log('Received validation request:', requestBody);

    await this.requestsService.updateRequestValidation(requestBody);
  }
  
};