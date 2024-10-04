import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from './fixtures.schema';
import { BetService } from 'bets/bets.service';
import { first } from 'rxjs';
import { WalletService } from 'wallet/wallet.service';
import { UsersService } from 'user/user.service';

@Injectable()
export class FixtureService {
  constructor(@InjectModel('Fixture') private readonly fixtureModel: Model<Fixture>,
  private readonly betService: BetService,
  private readonly usersService: UsersService) {}

  async createOrUpdateFixtures(fixturesData: any[]): Promise<any[]> {
    const updatedFixtures = await Promise.all(
      fixturesData.map(async (fixtureData) => {
        return await this.fixtureModel.findOneAndUpdate(
          { 'fixture.id': fixtureData.fixture.id },  // busca id
          fixtureData,  // si lo encuentra actualiza
          { upsert: true, new: true }  // si no lo encuentra, inserta (eso hace el upsert)
        );
      })
    );
    return updatedFixtures;
  }

  async getAllFixtures(page: number, count: number, filters: any): Promise<Fixture[]> {
    const query = this.fixtureModel.find(filters);

    // Ensure the date filter compares with current date
    const now = new Date();
    const currentTimestamp = now.getTime();

    // Apply the date filter to ensure fixtures are future fixtures
    if (filters['fixture.date']) {
      filters['fixture.date'] = { $gte: currentTimestamp };
    }

    return query
      .skip((page - 1) * count)
      .limit(count)
      .exec();
  }

  async getFixtureById(id: number): Promise<Fixture> {
    const fixture = await this.fixtureModel.findOne({ 'fixture.id': id }).exec();
    if (!fixture) {
      throw new NotFoundException(`Fixture with ID ${id} not found`);
    }
    return fixture;
  }


  async getOddsFromFixture(fixtureId: number): Promise<any> {
    const fixture = await this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
    if (!fixture) {
      throw new NotFoundException(`Fixture with ID ${fixtureId} not found`);
    }
    console.log('Odds:', fixture.odds);
    console.log('Odds values:', fixture.odds[0].values);
    console.log('Odds values length:', fixture.odds[0].values.length);
    //const first_value = fixture.odds[0].values[0];
    //const second_value = fixture.odds[0].values[1]?.odd ?? null;
    /*
    const odds = [];
    fixture.odds[0].values.map( (element) => {
      console.log('Value:', element.value);
      console.log('Odd:', element.odd);
      odds.push(element);
    });
    */
    const odds = fixture.odds[0].values.map( (element) => element);

    const first_value = odds.values[0];
    const second_value = odds.values[1].odd ;
    const third_value = odds.values[2].odd ;
    
    console.log('Odds:', odds);
    return fixture.odds;
  }

  async findFixtureById(fixtureId: number): Promise<Fixture> {
    return this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
  }

  async updateFixture(fixtureId: number, additionalCount: number): Promise<Fixture> {
    // Encuentra el documento por ID
    const fixture = await this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
  
    if (fixture) {
      // Realiza la suma utilizando el valor actual de bono_disponible
      fixture.bono_disponible += additionalCount;
  
      // Guarda el documento actualizado
      await fixture.save();
  
      return fixture;
    } else {
      // Maneja el caso en que el documento no se encuentra
      throw new Error('Fixture not found');
    }
  }
  
  async processHistoryFixtures(fixturesData: any[]): Promise<any[]> {
    // esta función va a actualizar las fixtures existentes cambiando sus datoss
    //console.log('Fixtures a actualizar:', fixturesData);
    const updatedFixtures = await Promise.all(
      fixturesData.map(async (fixtureData) => {
        const fixtureId = fixtureData.fixture.id;
  
        return await this.fixtureModel.findOneAndUpdate(
          { 'fixture.id': fixtureId }, 
          { $set: fixtureData }, // actualiza solo los campos que se pasan desde history
          { new: true, upsert: false } // no crear fixture si no existe
        ).exec();
      })
    );
    //console.log('Fixtures actualizadas:', updatedFixtures.length);
  
    return updatedFixtures; 
  }

  async UpdateBetsFromHistory(fixtureIds: number[]): Promise<void> {
    for (const fixtureId of fixtureIds) {
      const fixture = await this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
      if (fixture.fixture.status.long === 'Match Finished'){
        // solo analizar los terminados
        const homeTeam = fixture.teams.home.name;
        const awayTeam = fixture.teams.away.name;

        const homeGoals = fixture.goals.home;
        const awayGoals = fixture.goals.away;

        // ver casos que vienen nulos
        let winner;
        let odd;
        if (homeGoals === null || awayGoals === null|| fixture.odds[0].values[0].odd === null || fixture.odds.values.length === 0) 
        {
          continue;
        }
        const odds = fixture.odds[0].values.map( (element) => element);

        const home_value = odds.values[0];
        const draw_value = odds.values[1] ;
        const away_value = odds.values[2];

        if (homeGoals > awayGoals) {
          winner = homeTeam;
          odd = home_value.odd;
        } else if (awayGoals > homeGoals) {
          winner = awayTeam;
          odd = away_value.odd;
        } else if (homeGoals === awayGoals) {
          winner = '---';
          odd = draw_value.odd;
        }
        else {
          winner = null;
          continue;
        }
        const bets = await this.betService.findBetsByFixtureId(fixtureId);

        for (const bet of bets) {
          if (bet.status !== 'pending') {
            continue;
          }

          else {
            if (bet.result === winner) {
              // actualiza el bono
              //console.log('Bono ganado:', bet);
              bet.status = 'won';
              const money = bet.quantity * 1000 * odd;
              //await this.walletService.addMoneyToWallet(bet.id_usuario, money);
              // añadir dinero a la billetera en el user
              await this.usersService.addMoneyToUser(bet.id_usuario, money);
            }
            else {
              bet.status = 'lost';
            }

            await this.betService.updateBetStatus(bet.request_id, bet.status); 
          }
        }
      }

    }
  }



}