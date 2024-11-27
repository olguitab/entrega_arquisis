import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Auction } from "./auction.schema";

import { BetService } from "../bets/bets.service";
import { MqttService } from "mqtt/mqtt.service";

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel('Auction') private auctionModel: Model<Auction>,
    private readonly betService: BetService,
    private readonly mqttService: MqttService
  ) {}

  async offerToOtherGroups(body: any) : Promise<void> {
    // buscar los bonos de admin a ofrecer (vienen en el body),

    // crear el auction type: offer
    const auctionId = uuidv4();
    
    let auction = {
      auction_id: auctionId,
      proposal_id: "",
  
      fixture_id: body.fixture_id,
      league_name: body.league_name,
      round: body.round,
      result: body.result, 
  
      quantity: body.quantity,
      group_id: 23,
      type: 'offer',
    };
    await this.auctionModel.create(auction);

    // y ofertar la cantidad elegida a otros grupos en el broker, publicando en mqtt
    await this.mqttService.publishToMqttAuctions(JSON.stringify(auction));


    // creo que el bet dejaría de estar disponible paea comprar por parte de nuestros clientes

    // TODO: hacer algún ajuste con esa bet para que los usuarios no la compren. 

  }

  async getOurOffers() : Promise<Auction[]> {
    // buscar los auctions type: offer creados por el grupo
    // y retornarlos (para ver si tienen proposals asociadas)

    return await this.auctionModel.find({ group_id: 23, type: 'offer' });
  }

  async answerProporsal(body: any) : Promise<Auction> {
    // buscar el auction type: proposal con el id enviado y cambiar su estado a aceptado o rechazado (también en la data)

    // body.proposal_id es el uuid de proposal del auction type: proposal, y body.answer es "acceptance" o "rejection"
    let auction = this.auctionModel.updateOne({ auction_id: body.proposal_id }, { type: body.answer });

    // publicar respuesta al broker
    await this.mqttService.publishToMqttAuctions(JSON.stringify(auction));


    return auction;
  }

  async getOurProposals() : Promise<Auction[]> {
    // buscar los auctions type: proposal creados por el grupo
    // y retornarlos ( solo para ver su estado )
    // con proposal_id !== "", para ver nuestras propuestas enviadas, ya que filtrar por type: proposal no sería suficiente, 
    // debido a que cambia el type si se acepta or rechaza

    return await this.auctionModel.find({
      group_id: 23,
      proposal_id: { $ne: "" } // Excluye documentos donde proposal_id sea ""
    });

  }


  async getOtherOffers() : Promise<Auction[]> {
    // buscar los auctions type: offer creados por otros grupos
    // y retornarlos para poder verlos y enviar propuestas

    return await this.auctionModel.find({ group_id: { $ne: 23 }, type: 'offer' });
  }

  // debería recibir id (no sé si de fixture o proposal)
  async getOtherProposals() : Promise<Auction[]> {
    // buscar los auctions type: proposal creados por otros grupos (solo se deberían guardar si es para nosotros)
    // y retornarlos (para poder aceptar o rechazar)

    return await this.auctionModel.find({ group_id: { $ne: 23 }, type: 'proposal' });
  }

  async sendProposal(body: any) : Promise<void> {
    // buscar el auction type: offer con el id enviado y crear un auction type: proposal con la oferta
    const auction_info = await this.auctionModel.findOne({ auction_id: body.auctionId });

    const auctionId = uuidv4();
    const proposalId = uuidv4();

    if (body.quantity > auction_info.quantity) {
      throw new Error('Cannot propose more than the available quantity (send proposal)');
    }

    const auction_proposal = {
      auction_id: auctionId,
      proposal_id: proposalId,
  
      fixture_id: auction_info.fixture_id,
      league_name: auction_info.league_name,
      round: auction_info.round,
      result: auction_info.result, 
  
      quantity: body.quantity,
      group_id: 23,
      type: 'proposal',
    };

    await this.auctionModel.create(auction_proposal);

    // publicar la propuesta al broker
    await this.mqttService.publishToMqttAuctions(JSON.stringify(auction_proposal));
  }

  async manageBrokerMessage(body: any) : Promise<void> {
    // recibir mensajes del broker y gestionarlos según el tipo de auction
    body.group_id = Number(body.group_id);
    // si es type: offer, guardar en la base de datos para revisar las ofertas de otros grupos (si group_id !== 23)


    // si es type: proposal, guardar en la base de datos y publicar en mqtt para que el broker lo envíe a los grupos correspondientes
    // si es type: acceptance o rejection, guardar en la base de datos y publicar en mqtt para que el broker lo envíe a los grupos correspondientes

    if (body.type === 'offer') {
      await this.auctionModel.create(body);
    } else if (body.type === 'proposal') {
      await this.auctionModel.create(body);
      await this.mqttService.publishToMqttAuctions(JSON.stringify(body));
    } else if (body.type === 'acceptance' || body.type === 'rejection') {
      await this.auctionModel.updateOne({ auction_id: body.auction_id }, { type: body.type });
      await this.mqttService.publishToMqttAuctions(JSON.stringify(body));
    }
  }
}