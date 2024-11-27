// src/bet/bet.controller.ts
import { Body, Controller, Get, Param, Post, Req, UseGuards, } from '@nestjs/common';
import { Request } from 'express';
import { BetService } from './bets.service';
import { CreateBetDto } from './create-bet.dto';
import { Bet } from './bet.schema';
import { getLocationFromIP } from './location'; // Asegúrate de que la ruta de importación sea correcta
import { WalletService } from 'wallet/wallet.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TransactionService } from 'transactions/transactions.service';  // Asegúrate de tener acceso al servicio de transacciones

import { AuthGuard } from '@nestjs/passport';

import * as jwt from 'jsonwebtoken';

@Controller('api/bet')
export class BetController {
  constructor(private readonly betService: BetService, 
              private readonly walletService: WalletService,
              private readonly transactionService: TransactionService) {}

  @Get('recommendations/:userId')
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

  //@UseGuards(AuthGuard('jwt'))
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

    // console.log('Request headers:')
    // console.log(request.headers);

    const authorizationHeader = request.headers.authorization;

    //console.log('Authorization header:', authorizationHeader);
    let token;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      token = authorizationHeader.slice(7); // Elimina "Bearer " (7 caracteres)
      //console.log('Token:', token); 
    } else {
      console.log('No token found');
    }

    if (token !== undefined && token !== null) {
      console.log('Accede al token:', token);
      const decoded = jwt.verify(token, 'secretKey') as jwt.JwtPayload;
      //console.log('Decoded token:', decoded);
      const userRole = decoded.role;
      console.log('User role:', userRole);
      if (userRole === 'admin') {
        return await this.betService.createAdminBet(createBetDto);
      }
      else {
        console.log('Accede al token pero no es admin');
        return await this.betService.createbet(createBetDto);
      }      
    }

    return await this.betService.createbet(createBetDto);

  }

  @Get('reserved')
  async getReservedBets() : Promise<Bet[]> {
    return this.betService.getReservedBets();
  }
}
