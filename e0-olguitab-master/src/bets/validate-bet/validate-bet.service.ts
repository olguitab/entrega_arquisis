import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateBet } from './validate-bet.interface';

@Injectable()
export class ValidateBetService {
  constructor(
    @InjectModel('ValidateBet') private readonly ValidateBetModel: Model<ValidateBet>,
  ) {}

// En validate-bet.service.ts
async create(validateBetData: any): Promise<any> {
  const createdValidateBet = new this.ValidateBetModel(validateBetData);
  return createdValidateBet.save();
}

  async findAll(): Promise<ValidateBet[]> {
    return this.ValidateBetModel.find().exec();
  }

  // Agrega aquí más métodos según sea necesario
}