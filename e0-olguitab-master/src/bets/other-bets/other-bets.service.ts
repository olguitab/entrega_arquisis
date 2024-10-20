import { Inject, Injectable } from '@nestjs/common';
import { CreateOtherBetDto } from './dto/create-other-bet.dto';
import { UpdateOtherBetDto } from './dto/update-other-bet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtherBet } from './other-bets.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OtherBetsService {
  constructor(@InjectModel('OtherBet') private otherBetModel: Model<OtherBet>) {}


  create(createOtherBetDto: CreateOtherBetDto) {
    return 'This action adds a new otherBet';
  }

  findAll() {
    return `This action returns all otherBets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otherBet`;
  }

  update(id: number, updateOtherBetDto: UpdateOtherBetDto) {
    return `This action updates a #${id} otherBet`;
  }

  remove(id: number) {
    return `This action removes a #${id} otherBet`;
  }

  async findBetByRequestId(requestId: string): Promise<OtherBet> {
    //return `This action returns a bet with request_id ${requestId}`;
    console.log('Se quiere buscar OtherBet con request_id:', requestId);
    return await this.otherBetModel.findOne({ request_id: requestId }).exec();

  }

  async updateBetValidation(validationData: any): Promise<void> {
    const request_id = validationData.request_id;
    const status = validationData.valid ? 'Validated' : 'Rejected';
    await this.updateBetStatus(request_id, status);
  }

  async updateBetStatus(requestId: string, status: string): Promise<OtherBet> {
    const bet = await this.otherBetModel.findOne({ request_id: requestId }).exec();
    if (!bet) {
      throw new NotFoundException(`'No se encontró la otherBet al hacer updateBetStatus con request_id:', ${requestId}`);
    }
    bet.status = status;
    await bet.save();
    return bet;
  }
}
