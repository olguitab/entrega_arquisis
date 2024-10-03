// src/requests/requests.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';

@Injectable()
export class RequestsService {
  constructor(@InjectModel('Request') private readonly requestModel: Model<Request>) {}

  async create(data: any): Promise<Request> {
    const existingRequest = await this.requestModel.findOne({ uniqueId: data.uniqueId }).exec();
    if (existingRequest) {
      throw new Error('Request already exists');
    }
    const createdRequest = new this.requestModel(data);
    return createdRequest.save();
  }
}