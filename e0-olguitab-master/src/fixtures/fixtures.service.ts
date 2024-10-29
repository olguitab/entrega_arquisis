import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from './fixtures.schema';
import { BetService } from 'bets/bets.service';
import { AvailableBondsByFixture } from 'available-bonds/available-bonds-by-fixture.schema';
import { WalletService } from 'wallet/wallet.service';


@Injectable()
export class FixtureService {
  constructor(
    @InjectModel('Fixture') private readonly fixtureModel: Model<Fixture>,
    @InjectModel('AvailableBondsByFixture') private readonly availableBondsByFixtureModel: Model<AvailableBondsByFixture>,
    private readonly betService: BetService,
    private readonly walletService: WalletService
    ) {}

  async createOrUpdateFixtures(fixturesData: any[]): Promise<any[]> {
    const updatedFixtures = await Promise.all(
      fixturesData.map(async (fixtureData) => {
        const updatedFixture = await this.fixtureModel.findOneAndUpdate(
          { 'fixture.id': fixtureData.fixture.id },  // busca id
          fixtureData,  // si lo encuentra actualiza
          { upsert: true, new: true }  // si no lo encuentra, inserta (eso hace el upsert)
        );

        // Revisar si ya existe el AvailableBonds
        // console.log(`Checking if the fixture with id ${updatedFixture.fixture.id} has an AvailableBond associated`)
        const existingAvailableBond = await this.availableBondsByFixtureModel.findOne({
          fixtureId: updatedFixture.fixture.id,
        });
        // console.log(`Result: ${existingAvailableBond}`)
        // Si no existe, crear el AvailableBonds asociado al fixture
        if (!existingAvailableBond) {
          console.log("Creating an AvailableBond");
          await this.availableBondsByFixtureModel.create({
            fixtureId: updatedFixture.fixture.id, 
            availableBonds: 40 
          });
        }

        return updatedFixture;
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
    // console.log('Fixtures a actualizar:', fixturesData);
    if (!fixturesData) {
      throw new Error('fixtureData is null or undefined');
    
    }

    if (!Array.isArray(fixturesData)) {
      throw new Error('fixturesData is not an array');
    }

    // console.log('Primer elemento:', fixturesData[0]);
    // console.log('Fixture', fixturesData[0].fixture);
    const updatedFixtures = await Promise.all(
        fixturesData.map((fixtureData) => {
          
        const fixtureId = fixtureData.fixture.id;
  
        return this.fixtureModel.findOneAndUpdate(
          { 'fixture.id': fixtureId }, 
          { $set: fixtureData }, // actualiza solo los campos que se pasan desde history
          { new: true, upsert: false } // no crear fixture si no existe
        ).exec();
      })
    );

    // hay que cambiar este fixture que es el que no existe xd
    const fixtureIds = updatedFixtures
      .filter(fixture => fixture !== null) // Filtra los fixtures que no fueron encontrados
      .filter(fixture => fixture.fixture.status.short === 'FT') // Filtra los fixtures que ya han sido jugados
      // revisar que esté bien que sea FT
      .map(fixture => fixture.fixture.id);

    // console.log('Fixture IDs in process history map before checking bets:', fixtureIds);

  
    // TO DO: refactorizar a bets.service, primero ver que funcione bien

    for (const fixtureId of fixtureIds) {
      const fixture = await this.fixtureModel.findOne({ 'fixture.id': fixtureId }).exec();
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;

      const homeGoals = fixture.goals.home;
      const awayGoals = fixture.goals.away;

      // ver casos que vienen nulos
      let winner;
      let odd;
      // hacer un map de los odds porque son siempre 3 y typescript webea mas q la chucha
      const odds = fixture.odds[0].values.map((value) => value);

      if (homeGoals === null || awayGoals === null|| fixture.odds[0].values[0].odd === null) 
      {
        console.log('Fixture ID:', fixtureId);
        console.log('Home Team:', homeTeam);
        console.log('Away Team:', awayTeam);
        console.log('Home Goals:', homeGoals);
        console.log('Away Goals:', awayGoals);
        console.log('an odd', fixture.odds[0].values[0].odd);
        console.log("This fixture has null values, skipping");
        continue;
      }
      if (homeGoals > awayGoals) {
        winner = homeTeam;
        odd = odds[0].odd;
      } else if (awayGoals > homeGoals) {
        winner = awayTeam;
        odd = odds[2].odd;
      } else if (homeGoals === awayGoals) {
        winner = '---';
        odd = odds[1].odd;
      }
      else {
        winner = null;
      }
      // imprimir ganador e id del partido
      // console.log('Fixture ID:', fixtureId);
      // console.log('Home Team:', homeTeam);
      // console.log('Away Team:', awayTeam);
      // console.log('Winner:', winner);

      const bets = await this.betService.findBetsByFixtureId(fixtureId);
      // console.log('Bets:', bets);


      for (const bet of bets) {
        if (bet.status === 'Validated') { // en los otros casos como Pending, Won, Lost, no se hace nada
          if (bet.result === winner) {
            // que cambie el status a Won y se le añada el dinero a su wallet
            // console.log('Bet ganado:', bet);
            // console.log('Ganador:', winner);
            await this.betService.updateBetStatus(bet.request_id, 'Won');
            const moneyWon = bet.quantity * 1000 * odd;
            await this.walletService.updateWalletBalance(bet.id_usuario, moneyWon);

          } else {
            // cambio de estado a Lost y nada más
            // console.log('Bet perdido:', bet);
            // console.log('Ganador:', winner);
            await this.betService.updateBetStatus(bet.request_id, 'Lost');
          }
        }
      }
    }  
    
    return updatedFixtures; 
  }


}