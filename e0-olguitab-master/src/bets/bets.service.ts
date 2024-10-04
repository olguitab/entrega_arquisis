import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface'; // Asegúrate de que la ruta de importación sea correcta

@Injectable()
export class BetService {
  constructor(@InjectModel('Bet') private betModel: Model<Bet>,
) {}

// En tu archivo bets.service.ts o como lo hayas nombrado

async findBetsByUserId(userId: string): Promise<Bet[]> {
  return this.betModel.find({ id_usuario: userId }).exec();
}
  async findAll(): Promise<Bet[]> {
    return this.betModel.find().exec();
  }

  async createbet(createBetDto: CreateBetDto): Promise<Bet> {
    const createdBet = new this.betModel(createBetDto);
    await createdBet.save();
    return createdBet.toObject();
  }
}