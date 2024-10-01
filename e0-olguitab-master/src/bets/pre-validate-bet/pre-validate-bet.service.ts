// pre-validate-bet.service.ts
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

  // Agrega aquí más métodos según sea necesario
}