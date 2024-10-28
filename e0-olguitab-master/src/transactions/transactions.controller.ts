import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { Transaction } from './transactions.schema';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    async create(@Body() transactionData: Partial<Transaction>) {
        return this.transactionService.create(transactionData);
    }

    @Get()
    async findAll() {
        return this.transactionService.findAll();
    }

    @Post('commit')
    async commit(@Body() body: { token_ws: string; transactionId: string }) {
        return this.transactionService.commitTransaction(body.token_ws, body.transactionId);
    }

}
