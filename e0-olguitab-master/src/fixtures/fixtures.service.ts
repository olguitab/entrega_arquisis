import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from './fixtures.schema';
import { BetService } from 'bets/bets.service';

@Injectable()
export class FixtureService {
  constructor(@InjectModel('Fixture') private readonly fixtureModel: Model<Fixture>,
  private readonly betService: BetService) {}

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
    const fixtureIds = updatedFixtures.map(fixture => fixture.fixture.id);


    

    for (const fixtureId of fixtureIds) {
      const fixture = await this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
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
      if (homeGoals > awayGoals) {
        winner = homeTeam;
        odd = fixture.odds[0].values[0].odd;
      } else if (awayGoals > homeGoals) {
        winner = awayTeam;
        odd = fixture.odds[0].values[2].odd;
      } else if (homeGoals === awayGoals) {
        winner = '---';
        odd = fixture.odds[0].values[1].odd;
      }
      else {
        winner = null;
      }

      const bets = await this.betService.findBetsByFixtureId(fixtureId);

      for (const bet of bets) {
        if (bet.checked_result) {
          continue;
        }

        else {
          await this.betService.updateBetResult(bet.request_id, winner);

          if (bet.result === winner) {
            // actualiza el bono
            //console.log('Bono ganado:', bet);
            const money = bet.quantity * 1000 * odd;
          }
          else {
            //console.log('Bono perdido:', bet);
          }
        }
      }

    }
    
    return updatedFixtures; 
  }


}