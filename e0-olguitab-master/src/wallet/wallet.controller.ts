import { Controller, Post, Body, HttpStatus, Get, Param, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('add-money')
  async addMoney(@Body() requestBody: any): Promise<void> {
    const { user_id, amount } = requestBody;
    return this.walletService.addMoneyToWallet(user_id, amount);
  }

  @Get('balance/:user_id')
  async getBalance(@Param('user_id') user_id: string): Promise<number> {
    return this.walletService.getWalletBalance(user_id );
  }
}
