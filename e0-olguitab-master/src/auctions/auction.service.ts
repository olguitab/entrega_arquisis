import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Auction } from "./auction.schema";

import { BetService } from "../bets/bets.service";

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel('Auction') private auctionModel: Model<Auction>,
    private readonly betService: BetService,
  ) {}

  async offerToOtherGroups(body: any) {
    // buscar los bonos de admin a ofrecer (vienen en el body),
    // crear el auction type: offer
    // y ofertar la cantidad elegida a otros grupos en el broker

  }

  async getOurOffers() {
    // buscar los auctions type: offer creados por el grupoxcdfxcdf
    // y retornarlos (para ver si tienen proposals asociadas)
  }

  async answerProporsal(body: any) {
    // buscar el auction type: proposal con el id enviado y cambiar su estado a aceptado o rechazado (también en la data)
  }

  async getOurProposals() {
    // buscar los auctions type: proposal creados por el grupo
    // y retornarlos ( solo para verl su estado )
  }


  async getOtherOffers() {
    // buscar los auctions type: offer creados por otros grupos
    // y retornarlos para poder verlos y enviar propuestas
  }

  // debería recibir id (no sé si de fixture o proposal)
  async getOtherProposals() {
    // buscar los auctions type: proposal creados por otros grupos (solo se deberían guardar si es para nosotros)
    // y retornarlos (para poder aceptar o rechazar)
  }

  async sendProposal(body: any) {
    // buscar el auction type: offer con el id enviado y crear un auction type: proposal con la oferta
  }
}