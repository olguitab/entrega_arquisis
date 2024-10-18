import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvailableBondsByFixture } from './available-bonds-by-fixture.schema';

@Injectable()
export class AvailableBondsByFixtureService {
  constructor(
    @InjectModel('AvailableBondsByFixture') private readonly availableBondsByFixtureModel: Model<AvailableBondsByFixture>,
  ) {}

  // Create
  async createAvailableBondsByFixture(fixtureId: number, availableBonds: number): Promise<AvailableBondsByFixture> {
    const newAvailableBonds = new this.availableBondsByFixtureModel({ fixtureId, availableBonds });
    return newAvailableBonds.save();
  }

  // Get by fixtureId
  async findAvailableBondsByFixture(fixtureId: number): Promise<AvailableBondsByFixture | null> {
    return this.availableBondsByFixtureModel.findOne({ fixtureId }).exec();
  }

  async decrementAvailableBonds(fixtureId: number, quantity: number): Promise<AvailableBondsByFixture | null> {
    const availableBond = await this.availableBondsByFixtureModel.findOne({ fixtureId }).exec();

    if (availableBond && availableBond.availableBonds > 0) {
      console.log("Decrementing the amount of available bonds");
      return this.availableBondsByFixtureModel.findOneAndUpdate(
        { fixtureId },
        { $inc: { availableBonds: -quantity } },
        { new: true }
      ).exec();
    }

    throw new Error('No more available bonds for this fixture.');
  }

  async incrementAvailableBonds(fixtureId: number, quantity: number): Promise<AvailableBondsByFixture | null> {
    return this.availableBondsByFixtureModel.findOneAndUpdate(
      { fixtureId }, 
      { $inc: { availableBonds: quantity } }, 
      { new: true }
    ).exec();
  }

  async receiveValidation(fixtureId: number, quantity: number, validation: boolean): Promise<AvailableBondsByFixture | null> {
    if (!validation) {
      console.log(`Validation failed. Incrementing available bonds by ${quantity} for fixture ${fixtureId}`);
      return this.incrementAvailableBonds(fixtureId, quantity);
    }
    console.log(`Validation passed. No changes to available bonds for fixture ${fixtureId}`);
    return null;
  }

}
