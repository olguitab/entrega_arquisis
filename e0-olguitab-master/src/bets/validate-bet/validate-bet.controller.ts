import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ValidateBetService } from './validate-bet.service';
// import { ValidateBet } from './validate-bet.interface';

@Controller('validate-bet')
export class ValidateBetController {
  constructor(private readonly validateBetService: ValidateBetService) {}

  @Post()
  async processFixtures(@Body() requestBody: any): Promise<any> {
    try {
      console.log('Received request body:', requestBody);
      const { message } = requestBody;

      // Verifica si el mensaje tiene la estructura esperada
      if (!message || typeof message !== 'object') {
        console.log('Invalid data format:', requestBody);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data format',
        };
      }

      // Extrae los datos del mensaje y los mapea al esquema esperado
      const validateBetData = {
        request_id: message.request_id,
        group_id: message.group_id.toString(), // Convierte group_id a String si es necesario
        seller: message.seller,
        valid: message.valid,
      };
      console.log('Processing validate bet data:', validateBetData);

      // Guarda los datos en la base de datos
      const savedValidateBet = await this.validateBetService.create(validateBetData);
      console.log('Saved validate bet data:', savedValidateBet);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Validate bet data created successfully',
        data: savedValidateBet,
      };
    } catch (error) {
      console.error('Error processing validate bet data:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }
  @Get()
  async findAll(): Promise<any[]> {
    return this.validateBetService.findAll();
  }
}