import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBetDto } from './create-bet.dto';
import { Bet } from './bet.schema'; 
import { NotFoundException } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { AvailableBondsByFixtureService } from '../available-bonds/available-bonds-by-fixture.service';
import { WalletService } from '../wallet/wallet.service';


@Injectable()
export class BetService {
  constructor(@InjectModel('Bet') private betModel: Model<Bet>,
  private readonly mqttService: MqttService,
  private readonly availableBondsByFixtureService: AvailableBondsByFixtureService,
  private readonly walletService: WalletService

) {}

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

    // si usingWallet = true es porque no usamos webpay y el broker si nos devolverá la validación
    // al usar webpay, cambiar a false
    const usingWallet = true;


    // TODO: cambiar request_id por uuid
    const message = {
      request_id: createdBet.request_id,
      group_id: createdBet.group_id,
      fixture_id: createdBet.fixture_id,
      league_name: createdBet.league_name,
      round: createdBet.round,
      date: createdBet.date,
      result: createdBet.result,
      deposit_token: "",
      datetime: new Date().toISOString(),
      quantity: createdBet.quantity,
      wallet: usingWallet,
      seller: 0,

    };

    await this.mqttService.publishToMqtt(JSON.stringify(message));
    return createdBet.toObject();
  }

  async findBetsByFixtureId(fixtureId: number): Promise<Bet[]> {
    return this.betModel.find({ fixture_id: fixtureId }).exec();
  }

  async findBetByRequestId(requestId: string): Promise<Bet> {
    console.log('Se quiere buscar nuestro Bet con request_id:', requestId);
    const bet = await this.betModel.findOne({ request_id: requestId }).exec();
    // puede devolver nulo, se analiza en el validation, en request
    return bet;
  }

  async updateBetStatus(requestId: string, status: string): Promise<Bet> {
    const bet = await this.betModel.findOne({ request_id: requestId }).exec();
    if (!bet) {
      throw new NotFoundException(`Bet with request ID ${requestId} not found`);
    }
    bet.status = status;
    await bet.save();
    return bet;
  }

  async updateBetValidation(validationData: any): Promise<void> {
    const request_id = validationData.request_id;
    const status = validationData.valid ? 'Validated' : 'Rejected';
    const bet = await this.updateBetStatus(request_id, status);

    // si no es válido, restaurar bonos y devolver la plata
    if (!validationData.valid) {
      // se devuelven los bonos
      await this.availableBondsByFixtureService.incrementAvailableBonds(bet.fixture_id, bet.quantity);
      console.log('Restaurando bonos para el fixture con fixture_id:', bet.fixture_id);
      // se devuelve la plata
      await this.walletService.updateMoney(bet.id_usuario, bet.quantity * 1000);
      console.log('Restaurando dinero para el usuario en:', bet.quantity * 1000);

    }

  }


}