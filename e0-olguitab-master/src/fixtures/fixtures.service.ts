import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from './fixtures.schema';

@Injectable()
export class FixtureService {
  constructor(@InjectModel('Fixture') private readonly fixtureModel: Model<Fixture>) {}

    /*
  async createFixtures(fixturesData: any[]): Promise<any[]> {
    const savedFixtures = await Promise.all(
      fixturesData.map(async (fixtureData) => {
        const fixture = new this.fixtureModel(fixtureData);
        return await fixture.save();
      }),
    );
    return savedFixtures;
  }
    */

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
}