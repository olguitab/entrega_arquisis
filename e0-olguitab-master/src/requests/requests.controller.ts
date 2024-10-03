// src/requests/requests.controller.ts
import { Body, Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async processFixtures(@Body() requestBody: any): Promise<any> {
    try {
      console.log('Received request body:', requestBody);
      const { message } = requestBody;
      if (!message || !Array.isArray( message)) {
        console.log('Invalid data format:', message);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format',
        };
      }
      const fixtures = message
      console.log('Processing fixtures:', fixtures);

      const savedFixtures = await this.requestsService.createOrUpdateFixtures(fixtures);
      console.log('GUARDADO REQUEST:', savedFixtures);
    } catch (error) {
      console.error('Error REQUEST', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }}
};