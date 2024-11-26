// src/bet/bet.controller.ts
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BetService } from './bets.service';
import { CreateBetDto } from './create-bet.dto';
import { Bet } from './bet.schema';
import { getLocationFromIP } from './location'; // Asegúrate de que la ruta de importación sea correcta
import { WalletService } from 'wallet/wallet.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TransactionService } from 'transactions/transactions.service';  // Asegúrate de tener acceso al servicio de transacciones


@Controller('api/bet')
export class BetController {
  constructor(private readonly betService: BetService, 
              private readonly walletService: WalletService,
              private readonly transactionService: TransactionService) {}

  @Get(':userId')
  async getRecommendations(@Param('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.betService.getRecommendations(userId);
  }

  @Get('history/:userId') // Define la ruta para aceptar un userId como parámetro
  async findHistoryByUserId(@Param('userId') userId: string): Promise<Bet[]> {
    return this.betService.findBetsByUserId(userId);
  }

  
  // Controlador
  @Get('/job/:obId')
  async getjob(@Param('obId') obId: string) {
    if (!obId) {
      throw new BadRequestException('Job ID is required');
    }
    try {
      return await this.betService.getjob(obId);
    } catch (error) {
      // Captura y lanza el error original
      throw new InternalServerErrorException(error.message || 'Error fetching job results');
    }
  }

  @Get() 
  findAll(): Promise<Bet[]> { 
    return this.betService.findAll(); 
  }


  @Post()
  async create(@Body() createBetDto: CreateBetDto, @Req() request: Request): Promise<Bet> {
    // Intenta obtener la dirección IP del cliente de varias maneras, priorizando 'x-forwarded-for'
    let ipAddress = request.headers['x-forwarded-for'] || request.ip || request.connection.remoteAddress;
    if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0];
    }

    // Si ipAddress todavía es un array o undefined, asegúrate de que se convierta en un string vacío o maneja según sea necesario
    if (typeof ipAddress !== 'string') {
      console.error('No se pudo determinar la dirección IP del cliente.');
      throw new Error('No se pudo determinar la dirección IP del cliente.');
    }

    try {
      // Obtiene la ubicación a partir de la dirección IP y la asigna al DTO
      const location = await getLocationFromIP(ipAddress);
      createBetDto.ipAddress = ipAddress; // Asegúrate de que tu DTO pueda aceptar la dirección IP
      createBetDto.country = location.country_name; // Asegúrate de que tu DTO y esquema de base de datos puedan aceptar estos campos
      createBetDto.city = location.city;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      // Maneja el error según sea necesario
    }
    
    const createdBet = await this.betService.createbet(createBetDto);

    /* Esto debe estar directamente en wallet
    const moneySpent = createdBet.quantity * 1000;
    this.walletService.updateWalletBalance(createdBet.id_usuario, -moneySpent); 
    */
    // await this.transactionService.checkBetCreation(createdBet);
    return createdBet;
  }

  @Get('reserved')
  async getReservedBets() : Promise<Bet[]> {
    return this.betService.getReservedBets();
  }
}
