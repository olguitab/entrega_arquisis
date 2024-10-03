import { Controller, Post, Body, HttpStatus, Get, Param, Query, NotFoundException, BadRequestException, Patch } from '@nestjs/common';
import { FixtureService } from './fixtures.service';
import { BetService } from 'bets/bets.service';

@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixtureService: FixtureService,
    private readonly betService: BetService
  ) {};


  @Post('process')
  async processFixtures(@Body() requestBody: any): Promise<any> {
    try {
      const { message } = requestBody;
      //('Received request body process fixtures:', message.fixtures);
      
      if (!message || !Array.isArray(message.fixtures)) {
        console.log('Invalid data format in processFixtures:', requestBody);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format',
        };
      }
      const savedFixtures = await this.processFixturesData(message.fixtures);
      

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Fixtures created successfully',
        data: savedFixtures,
      };
    } catch (error) {
      console.error('Error processing fixtures:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }
  
  private validateMessage(message: any): { isValid: boolean; error?: any } {
    if (!message || !Array.isArray(message.fixtures)) {
      console.log('Invalid data format:', message);
      return {
        isValid: false,
        error: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format',
        },
      };
    }

    return { isValid: true };
  }


  private async processFixturesData(fixtures: any[]): Promise<any> {
    //console.log('Processing fixtures:', fixtures);

    const savedFixtures = await this.fixtureService.createOrUpdateFixtures(fixtures);
    //console.log('Saved fixtures:', savedFixtures);

    return savedFixtures;
  }

  @Patch('history')
  async processHistoryFixtures(@Body() requestBody: any): Promise<any> {
    try {
      //console.log('Enter patch for history');
      const { message } = requestBody;
  
      // Usar la función de validación
      const validation = this.validateMessage(message);
      if (!validation.isValid) {
        return validation.error;
      }

      await this.fixtureService.processHistoryFixtures(message.fixtures);


      // crear un array con los ids de updated fixtures para pasárselo a la función de buscar bets de esos fixtures

  
      //console.log('Additional processing for history...');
      // acá filtrar los ids y buscar bonos comprados de esos partidos, mandar los savedFixtures
      // allá procesar según ids de partidos y actualizar bonos que estén con estado pendiente
  
      // Agregar lógica adicional aquí...

      return ;
    } catch (error) {
      console.error('Error processing fixture history:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }



  @Get(':id')
  async getFixtureById(@Param('id') id: string): Promise<any> {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('Invalid ID format');
      }
      const fixture = await this.fixtureService.getFixtureById(numericId);
      return {
        statusCode: HttpStatus.OK,
        data: fixture,
      };
    } catch (error) {
      console.error('Error al obtener el fixture:', error);
      throw error;
    }
  }

  @Get()
  async getAllFixtures(
    @Query('page') page: string = '1',
    @Query('count') count: string = '25',
    @Query('home') home: string,
    @Query('away') away: string,
    @Query('visit') visit: string,
    @Query('date') date: string,
  ): Promise<any> {
    try {
      const pageNumber = parseInt(page, 10);
      const countNumber = parseInt(count, 10);

      if (pageNumber <= 0 || countNumber <= 0) {
        throw new BadRequestException('Invalid page or count number');
      }

      const filters: any = {};

      if (home) {
        filters['teams.home.name'] = home;
      }
      if (away || visit) {
        filters['teams.away.name'] = away || visit;
      }
      if (date) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          throw new BadRequestException('Invalid date format');
        }
        filters['fixture.date'] = { $gte: dateObj }; // Use Date object directly
      }

      const fixtures = await this.fixtureService.getAllFixtures(pageNumber, countNumber, filters);
      return {
        statusCode: HttpStatus.OK,
        data: fixtures,
      };
    } catch (error) {
      console.error('Error al obtener fixtures:', error);
      throw error;
    }
  }
}

