import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ValidateBetService } from './validate-bet.service';
import { PreValidateBetService } from 'bets/pre-validate-bet/pre-validate-bet.service';
import { BetService } from 'bets/bets.service';
import { WalletService } from 'wallet/wallet.service'; // Asegúrate de tener la ruta correcta
// Asegúrate de tener la interfaz correcta importada si la estás usando
// import { ValidateBet } from './validate-bet.interface';

@Controller('validate-bet')
export class ValidateBetController {
  constructor(
    private readonly validateBetService: ValidateBetService,
    private readonly preValidateBetService: PreValidateBetService,// Añade esto
    private readonly betService: BetService,
    private readonly walletService: WalletService, 
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
        console.log('Found matching PreValidateBet record, id_usuario:', preValidateBetRecord.id_usuario.toString());

        // Busca el objeto Wallet correspondiente al id_usuario
        const wallet = await this.walletService.findByUserId(preValidateBetRecord.id_usuario.toString());
        if (wallet) {
          // Resta a "money" los "preValidateBetRecord.quantity"*1000
          const newMoneyValue = wallet.money - (preValidateBetRecord.quantity * 1000);
          // Actualiza el objeto Wallet con el nuevo valor de "money"
          await this.walletService.updateMoney(wallet.id, newMoneyValue);
          console.log(`Wallet updated for user ${wallet.user_id}: new money value is ${newMoneyValue}`);
        } else {
          console.log(`No Wallet found for user ${preValidateBetRecord.id_usuario.toString()}`);
          // Maneja adecuadamente la situación, por ejemplo, lanzando un error o retornando un mensaje específico
        }
        this.preValidateBetService.deleteAll();
        // Aquí continúa tu lógica existente para manejar la creación de la Bet...

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
  }
}

  @Get()
  async findAll(): Promise<any[]> {
    return this.validateBetService.findAll();
  }
}