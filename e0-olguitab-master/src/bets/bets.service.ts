import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBetDto } from './create-bet.dto';
import Bet from './bet.interface'; 
import { NotFoundException } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { AvailableBondsByFixtureService } from '../available-bonds/available-bonds-by-fixture.service';


@Injectable()
export class BetService {
  constructor(@InjectModel('Bet') private betModel: Model<Bet>,
  private readonly mqttService: MqttService,
  private readonly availableBondsByFixtureService: AvailableBondsByFixtureService,

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

    console.log("Creating a bet triggered by front signal")
    // Mandar señal de post al mqtt
    const message = {
      request_id: createdBet._id,
      group_id: createdBet.group_id,
      fixture_id: createdBet.fixture_id,
      league_name: createdBet.league_name,
      round: createdBet.round,
      date: createdBet.date,
      result: createdBet.result,
      deposit_token: "",
      datetime: new Date().toISOString(),
      quantity: createdBet.quantity,
      seller: 0

    };

    await this.mqttService.publishToMqtt(JSON.stringify(message));
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