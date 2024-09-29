// initialization.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fixture } from 'fixtures/fixtures.schema'; // Asegúrate de importar tu esquema de Fixture correctamente

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(@InjectModel("Fixture") private fixtureModel: Model<Fixture>) {}

  async onModuleInit() {
    await this.cleanFixtures();
  }

  async cleanFixtures() {
    try {
      //await this.fixtureModel.deleteMany({}); // Esto elimina todos los documentos en la colección Fixtures
      //console.log('Todos los datos de Fixtures han sido eliminados.');
      console.log('Ya no se eliminan datos 2.');
    } catch (error) {
      console.error('Error al limpiar la colección Fixtures:', error);
    }
  }
}