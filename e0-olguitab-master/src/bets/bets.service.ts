import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface'; // Asegúrate de que la ruta de importación sea correcta
import { PreValidateBet } from './pre-validate-bet/pre-validate-bet.interface';

@Injectable()
export class BetService {
  constructor(@InjectModel('Bet') private betModel: Model<Bet>, @InjectModel('PreValidateBet') private readonly preValidateBetModel: Model<PreValidateBet>,
) {}

  async findAll(): Promise<Bet[]> {
    return this.betModel.find().exec();
  }

  async createbet(createBetDto: CreateBetDto): Promise<Bet> {
    const createdBet = new this.betModel(createBetDto);
    await createdBet.save();
    return createdBet.toObject();
  }
  async validateAndCreateBet(validateBetDto): Promise<any> {
    const { request_id, valid } = validateBetDto;

    if (valid) {
      // Aquí, asumiendo que tienes un modelo o una lógica para manejar las apuestas validadas
      // Podrías buscar el registro por request_id y luego actualizarlo o moverlo a otra colección/tabla según sea necesario
      const bet = await this.preValidateBetModel.findOne({ request_id });

      if (bet) {
        // Aquí, implementa la lógica para marcar la apuesta como validada o moverla a otra colección/tabla
        // Por ejemplo, actualizar un campo 'status' o similar// Asume que tienes un campo 'status'
        await bet.save();

        // Implementa cualquier otra lógica necesaria para manejar la apuesta validada
        return bet;
      } else {
        throw new Error('Bet not found');
      }
    } else {
      // Manejar el caso en que la apuesta no es válida
      // Por ejemplo, puedes querer registrar esto o tomar alguna acción específica
      throw new Error('Bet is not valid');
    }
  }
}