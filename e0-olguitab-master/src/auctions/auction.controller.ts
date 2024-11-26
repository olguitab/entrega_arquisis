import { Controller, Post, Body, Put, HttpStatus, Get, Param, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auctions')


// todo este controlador debería ser protegido para admin. 


@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('offer')
  async offerToOtherGroups(@Body() body: any) {

    // que venga en la data qué bet se debe ofertar y cuantos

    if (!body.auctionId || !body.quantity) {
      throw new BadRequestException('Missing required fields');
    }

    return this.auctionService.offerToOtherGroups(body);
  }

  @Get('our-offers')
  async getOurOffers() {
    return this.auctionService.getOurOffers();
  }

  @Post('answer-proporsal')
  async answerProporsal(@Body() body: any) {
    if (!body.proporsalId || !body.answer) {
      throw new BadRequestException('Missing required fields');
    }

    return this.auctionService.answerProporsal(body);
  }
  
  @Get('other-offers') // para ver las ofertas de otros grupos y poder enviar propuestas
  async getOtherOffers() {
    return this.auctionService.getOtherOffers();
  }

  @Get('our-proposals')
  async getOurProposals() {
    return this.auctionService.getOurProposals();
  } 


  @Get('other-proposals/:id') // quizás debería ser por fixture_id o algo así si se quiere ver junto con la offer del mismo proposal
  async getOtherProposals() {
    return this.auctionService.getOtherProposals();
  }

  @Post('send-proposal')
  async sendProposal(@Body() body: any) {
    if (!body.auctionId || !body.value) {
      throw new BadRequestException('Missing required fields');
    }

    return this.auctionService.sendProposal(body);
  }
  
  
}
