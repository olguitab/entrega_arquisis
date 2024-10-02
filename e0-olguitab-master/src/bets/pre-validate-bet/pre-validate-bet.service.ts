import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreValidateBet } from './pre-validate-bet.interface';

@Injectable()
export class PreValidateBetService {
  constructor(
    @InjectModel('PreValidateBet') private readonly preValidateBetModel: Model<PreValidateBet>,
  ) {}

  async create(createPreValidateBetDto: PreValidateBet): Promise<PreValidateBet> {
    const createdBet = new this.preValidateBetModel(createPreValidateBetDto);
    return createdBet.save();
  }

  async findAll(): Promise<PreValidateBet[]> {
    return this.preValidateBetModel.find().exec();
  }
  async deleteAll(): Promise<void> {
    // Aquí asumimos que tienes un método o forma de eliminar todos los registros
    await this.preValidateBetModel.deleteMany({});
    console.log('Todos los datos de PreValidateBet han sido eliminados.');
  }

  // Agrega aquí más métodos según sea necesario
}