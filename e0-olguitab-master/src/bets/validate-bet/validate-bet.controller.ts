import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ValidateBetService } from './validate-bet.service';
import { PreValidateBetService } from 'bets/pre-validate-bet/pre-validate-bet.service';
import { BetService } from 'bets/bets.service';
// Asegúrate de tener la interfaz correcta importada si la estás usando
// import { ValidateBet } from './validate-bet.interface';

@Controller('validate-bet')
export class ValidateBetController {
  constructor(
    private readonly validateBetService: ValidateBetService,
    private readonly preValidateBetService: PreValidateBetService,// Añade esto
    private readonly betService: BetService 
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

      if (message.group_id.toString() == "23" /*&& message.valid == "true"*/) {
        console.log('Processing validate bet data:', validateBetData);

        // Guarda los datos en la base de datos
        const savedValidateBet = await this.validateBetService.create(validateBetData);
        console.log('Saved validate bet data:', savedValidateBet);

        // Busca el id_usuario en PreValidateBet que tenga el mismo id_request
        const preValidateBetRecord = await this.preValidateBetService.findByIdRequest(message.request_id);
        if (preValidateBetRecord) {
          console.log('Found matching PreValidateBet record, id_usuario:', preValidateBetRecord.id_usuario);
        
          // Aquí construyes el objeto con los datos para la nueva Bet
          const betData = {
            id_usuario: preValidateBetRecord.id_usuario.toString(),
            request_id: message.request_id,
            // Añade aquí el resto de campos necesarios para crear la Bet
            group_id: message.group_id.toString(),
            fixture_id: preValidateBetRecord.fixture_id,
            league_name: preValidateBetRecord.league_name,
            round: preValidateBetRecord.round,
            date: preValidateBetRecord.date,
            result: preValidateBetRecord.result,
            deposit_token: preValidateBetRecord.deposit_token,
            datetime: new Date().toISOString(),
            quantity: preValidateBetRecord.quantity,
            seller: message.seller,
          };
        
          // Utiliza el betService para crear la nueva Bet
          const createdBet = await this.betService.createbet(betData);
          console.log('Bet created successfully:', createdBet);

          // Puedes incluir la información del Bet creado en la respuesta si es necesario
        } else {
          console.log('No matching PreValidateBet record found', message.request_id);
          // Maneja adecuadamente la situación
        }

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Validate bet data created successfully',
          data: savedValidateBet,
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
  async findAll(): Promise<any[]> {
    return this.validateBetService.findAll();
  }
}