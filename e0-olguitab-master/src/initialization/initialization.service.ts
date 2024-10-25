// initialization.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from 'fixtures/fixtures.schema'; // Asegúrate de importar tu esquema de Fixture correctamente
import { Bet } from 'bets/bet.schema';
import { Transaction } from 'transactions/transactions.schema' 

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectModel("Fixture") private fixtureModel: Model<Fixture>,
    @InjectModel('Bet') private betModel: Model<Bet>,
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
  ) {}

  async onModuleInit() {
    await this.cleanFixtures();
  }

  async cleanFixtures() {
    try {
      await this.transactionModel.deleteMany({}); // Esto elimina todos los documentos en la colección Fixtures
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
}