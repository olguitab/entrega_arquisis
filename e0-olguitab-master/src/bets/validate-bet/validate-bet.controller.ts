// pre-validate-bet.controller.ts
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ValidateBetService } from './validate-bet.service';
import { PreValidateBetService } from 'bets/pre-validate-bet/pre-validate-bet.service';
import { ValidateBet } from './validate-bet.interface';
// Asegúrate de tener la interfaz correcta importada si la estás usando
// import { ValidateBet } from './validate-bet.interface';

@Controller('validate-bet')
export class ValidateBetController {
  constructor(
    private readonly validateBetService: ValidateBetService,
    private readonly preValidateBetService: PreValidateBetService// Añade esto
  ) {}

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

      if (message.group_id.toString() == "23" && message.valid == "true") {
        console.log('Processing validate bet data:', validateBetData);

        // Guarda los datos en la base de datos
        console.log('Saved validate bet data:', validateBetData);

        // Busca el id_usuario en PreValidateBet que tenga el mismo id_request
        const preValidateBetRecord = await this.preValidateBetService.findByIdRequest(validateBetData.request_id);
        if (preValidateBetRecord) {
          console.log('Found matching PreValidateBet record, id_usuario:', preValidateBetRecord.id_usuario);
        } else {
          console.log('No matching PreValidateBet record found');
          // Maneja adecuadamente la situación, por ejemplo, lanzando un error o devolviendo una respuesta específica.
        }

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Validate bet data created successfully',
          data: validateBetData,
        };
      }
    } catch (error) {
      console.error('Error processing validate bet data:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    } }

  @Get()
  findAll(): Promise<ValidateBet[]> {
    return this.validateBetService.findAll();
  }

  // Agrega aquí más métodos según sea necesario
}