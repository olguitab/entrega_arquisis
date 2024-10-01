// src/bet/bet.controller.ts
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BetService } from './bets.service';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface';
import { PreValidateBetDto } from './pre-validate-bet/pre-validate-bet.dto';

@Controller('api/bet')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Get()
  findAll(): Promise<Bet[]> {
    return this.betService.findAll();
  }
  @Get('processvalidate')
  async getProcessedFixtures(): Promise<any> {
    try {
      // Aquí necesitarías implementar la lógica para recuperar y devolver los datos deseados.
      // Por ejemplo, recuperar las últimas apuestas procesadas/validadas desde tu servicio.
      const processedBets = await this.betService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Processed bets retrieved successfully',
        data: processedBets,
      };
    } catch (error) {
      console.error('Error retrieving processed bets:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }

  @Post() 
  async create(@Body() createprevet: PreValidateBetDto){
    // Asegúrate de que betDetails esté correctamente formado a partir de createBetDto
    const betDetails = {
      ...createprevet,
      // Aquí puedes agregar o modificar propiedades según sea necesario
    };

  }

  @Post('processvalidate')
  async processValidate(@Body() body): Promise<any> {
    const { topic, message } = body;

    // Filtrar por group_id "23"
    if (message.group_id === "23") {
      try {
        // Lógica para buscar en la tabla pre-validate-bet por request_id y marcar como bet
        const result = await this.betService.validateAndCreateBet(message);
        return {
          statusCode: HttpStatus.OK,
          message: 'Bet processed successfully',
          data: result,
        };
      } catch (error) {
        console.error('Error processing bet:', error);
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Group ID not matched',
      };
    }
  }
}