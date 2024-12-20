// initialization.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from 'fixtures/fixtures.schema'; // Asegúrate de importar tu esquema de Fixture correctamente
import { Bet } from 'bets/bet.schema';
import { Transaction } from 'transactions/transactions.schema';
import { User } from 'user/user.schema';
import { UserRole } from 'user/user-role.enum';
import { UsersService } from 'user/user.service';

import { AvailableBondsByFixture } from 'available-bonds/available-bonds-by-fixture.schema';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectModel('Fixture') private fixtureModel: Model<Fixture>,
    @InjectModel('Bet') private betModel: Model<Bet>,
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    @InjectModel('AvailableBondsByFixture') private availableBondsByFixtureModel: Model<AvailableBondsByFixture>,
    @InjectModel('User') private userModel: Model<User>,
    private userService: UsersService
  ) {}

  async onModuleInit() {
    //await this.cleanFixtures();
    //await this.addAvailableBondsToFixtures();
    //await this.updateUserRoles();
    //await this.userService.createAdmin();
  }

  async cleanFixtures() {
    try {
      // await this.transactionModel.deleteMany({}); // Esto elimina todos los documentos en la colección Fixtures
      //console.log('Todos los datos de Fixtures han sido eliminados.');
      console.log('Ya no se eliminan datos 2.');
    } catch (error) {
      console.error('Error al limpiar la colección Fixtures:', error);
    }
  }

  async updateBetsStatus() {
    try {
      // Actualiza todas las apuestas que no tienen el campo 'status' a 'Pending'
      const result = await this.betModel.updateMany(
        { status: { $exists: false } }, // Solo actualiza las apuestas que no tienen el campo 'status'
        { $set: { status: 'Pending' } } // Establece el campo 'status' en 'Pending'
      );
      //console.log(`${result.modifiedCount} apuestas actualizadas a "Pending".`);
      console.log('Apuestas actualizadas.');
    } catch (error) {
      console.error('Error al actualizar los estados de las apuestas:', error);
    }
  }

  async addAvailableBondsToFixtures() {
    try {
      // Encuentra todos los fixtures con availableBonds
      const fixtures = await this.availableBondsByFixtureModel.find();
  
      // Recorre y actualiza cada fixture
      for (const fixture of fixtures) {
        await this.availableBondsByFixtureModel.updateOne(
          { _id: fixture._id },  // Usar el _id para identificar el fixture
          { availableBonds: 20 }  // Actualiza el valor a 20
        );
      }
      console.log("Todos los availableBonds fueron actualizados a 20.");
    } catch (error) {
      console.error("Error actualizando availableBonds en fixtures:", error);
    }
  }

  async updateUserRoles() {
    await this.userModel.updateMany(
      { role: { $exists: false } }, // Condición: si no tienen rol
      { $set: { role: UserRole.Client } } // Asigna el rol `client`
    );
  }
  
}