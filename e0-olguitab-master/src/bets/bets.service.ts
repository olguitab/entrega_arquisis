import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface'; // Asegúrate de que la ruta de importación sea correcta
import { NotFoundException } from '@nestjs/common';

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

  async findBetsByFixtureId(fixtureId: number): Promise<Bet[]> {
    return this.betModel.find({ fixture_id: fixtureId }).exec();
  }

  async updateBetResult(requestId: string, result: string): Promise<void> {
    const bet = await this.betModel.findOne({ request_id: requestId }).exec();

    if (!bet) {
      throw new NotFoundException(`Bet with request ID ${requestId} not found`);
    }

    //bet.checked_result = true;
    await bet.save();

  }
}