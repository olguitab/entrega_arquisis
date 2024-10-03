import { Controller, Post, Body, HttpStatus, Get, Param, Query, BadRequestException } from '@nestjs/common';
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
      console.log('Received request body:', requestBody);
      const { message } = requestBody.message;

      if (!message || !Array.isArray(requestBody)) {
        console.log('Invalid data format:', message.fixtures);
        throw new BadRequestException('Invalid data format');
      }

      const fixtures = message.fixtures;
      console.log('Processing fixtures:', fixtures);

      const savedFixtures = await this.fixtureService.createOrUpdateFixtures(fixtures);
      console.log('Saved fixtures:', savedFixtures);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Fixtures created successfully',
        data: savedFixtures,
      };
    } catch (error) {
      console.error('Error processing fixtures:', error);
      throw new BadRequestException('Internal Server Error');
    }
  }

  @Post('requests')
async processRequest(@Body() requestBody: any[]): Promise<any> {
  if (!Array.isArray(requestBody)) {
    throw new BadRequestException('Invalid data format, expected an array');
  }

  const fixtureCounts: { [key: number]: number } = requestBody.reduce((acc, item) => {
    if (typeof item.fixture_id === 'number') {
      acc[item.fixture_id] = (acc[item.fixture_id] || 0) + 1;
    }
    return acc;
  }, {});

  for (const [fixtureId, count] of Object.entries(fixtureCounts)) {
    try {
      const numericFixtureId = Number(fixtureId);
      const numericCount = Number(count); // Asegúrate de que 'count' se trate como un número.
      const fixture = await this.fixtureService.findFixtureById(numericFixtureId);
      if (fixture) {
        await this.fixtureService.updateFixture(numericFixtureId, fixture.bono_disponible + numericCount);
      }
    } catch (error) {
      console.error('Error updating fixture:', error);
    }
  }
  return {
    statusCode: HttpStatus.OK,
    message: 'Fixtures processed successfully',
  };
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
      if (!fixture) {
        throw new BadRequestException('Fixture not found');
      }
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
        filters['fixture.date'] = { $gte: dateObj };
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
