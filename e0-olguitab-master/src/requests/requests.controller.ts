// src/requests/requests.controller.ts
import { Body, Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() body: any) {
    try {
      const request = await this.requestsService.create(body.data.message);
      return request;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
}