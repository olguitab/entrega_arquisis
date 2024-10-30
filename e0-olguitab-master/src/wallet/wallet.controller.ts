import { Controller, Post, Body, Put, HttpStatus, Get, Param, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('add-money')
  async addMoney(@Body() requestBody: any): Promise<void> {
    const { user_id, amount } = requestBody;
    return this.walletService.updateWalletBalance(user_id, amount);
  }

  @Get('balance/:user_id')
  async getBalance(@Param('user_id') user_id: string): Promise<number> {
    return this.walletService.getWalletBalance(user_id );
  }

  @Get('all')
  async getAll(): Promise<any> {
    const wallets = await this.walletService.findAll();
    if (!wallets) {
      throw new Error('Wallets no encontradas');
    }
    return wallets;
  }

  @Put('update/:user_id')
  async updateWalletBalance(
    @Param('user_id') user_id: string,
    @Body('amount') amount: number
  ): Promise<void> {
    await this.walletService.updateWalletBalance(user_id, amount);
  }

}
