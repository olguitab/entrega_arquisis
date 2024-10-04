// src/requests/requests.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';

@Injectable()
export class RequestsService {
  constructor(@InjectModel('Request') private readonly requestModel: Model<Request>) {}

  async createOrUpdateFixtures(fixtureData: any): Promise<any> {
    // Primero, intenta encontrar un documento con el request_id dado.
    const existingRequest = await this.requestModel.findOne({ 'request_id': fixtureData.request_id });

    if (!existingRequest) {
      // Si no existe, crea un nuevo documento.
      const newRequest = new this.requestModel(fixtureData);
      return await newRequest.save();
    } else {
      // Si ya existe, puedes decidir no actualizarlo y simplemente retornar el existente,
      // o manejar la situación de alguna otra manera que consideres apropiada.
      // En este caso, simplemente retornamos el documento existente sin hacer cambios.
      return existingRequest;
    }
  }

  async calculateTotalRequestsByFixtureId(fixture_id: number): Promise<number> {
    console.log('fixture_id:', fixture_id);
    return await this.requestModel.countDocuments({ 'fixture_id': fixture_id });
  }
}