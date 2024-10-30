// src/requests/requests.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './requests.schema';
import { request } from 'http';

// necesito importar los servicios de bets, y other bets
import { BetService } from '../bets/bets.service';
import { OtherBetsService } from '../bets/other-bets/other-bets.service';

@Injectable()
export class RequestsService {
  constructor(@InjectModel('Request') private readonly requestModel: Model<Request>,
            private readonly betService: BetService,
            private readonly otherBetsService: OtherBetsService) 
            {}


  async updateRequestValidation(validationData: any): Promise<any> {
    const request_id = validationData.request_id;
    const is_valid = validationData.valid;

    // necesitamos buscar los bonos ya sean nuestros o de otros grupos
    const our_bet = await this.betService.findBetByRequestId(request_id);
    const other_bet = await this.otherBetsService.findBetByRequestId(request_id);

    const bet_request = our_bet || other_bet;

    if (!bet_request) {
      console.log('No se encontró la solicitud de validación de apuesta con request_id:', request_id);
      return;
    }

    
    if (our_bet) {
      // que actualice el estado de la apuesta, revisando si es válido o no. si no lo es, restaurar el wallet y los bonos disponibles
      await this.betService.updateBetValidation(validationData);
    }
    else {
      // creo que da lo mismo actualizar el estado de las que no son nuestras pero por si acaso
      // que se encargue de actualizar los bonos disponibles
      await this.otherBetsService.updateBetValidation(validationData);
    }
    
    return { message: 'Request validation processed' };


  }
}