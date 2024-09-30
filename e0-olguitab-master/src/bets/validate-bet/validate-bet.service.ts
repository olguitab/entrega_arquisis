// pre-validate-bet.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateBet } from './validate-bet.interface';

@Injectable()
export class ValidateBetService {
  constructor(
    @InjectModel('ValidateBet') private readonly ValidateBetModel: Model<ValidateBet>,
  ) {}

  async create(createValidateBetDto: ValidateBet): Promise<ValidateBet> {
    const createdBet = new this.ValidateBetModel(createValidateBetDto);
    return createdBet.save();
  }

  async findAll(): Promise<ValidateBet[]> {
    return this.ValidateBetModel.find().exec();
  }

  // Agrega aquí más métodos según sea necesario
}