import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { Transaction } from './transactions.schema';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    // Crear una nueva transacción
    @Post()
    async create(@Body() transactionData: Partial<Transaction>) {
        return this.transactionService.create(transactionData);
    }

    // Obtener todas las transacciones
    @Get()
    async findAll() {
        return this.transactionService.findAll();
    }

    @Post('commit')
    async commit(@Body() body: { token_ws: string; transactionId: string }) {
        console.log('transaction:', body.transactionId)
        return this.transactionService.commitTransaction(body.token_ws, body.transactionId);
    }

    // // Obtener una transacción por ID
    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     return this.transactionService.findOne(id);
    // }

    // // Actualizar una transacción por ID
    // @Patch(':id')
    // async update(@Param('id') id: string, @Body() updateData: Partial<Transaction>) {
    //     return this.transactionService.update(id, updateData);
    // }

    // // Eliminar una transacción por ID
    // @Delete(':id')
    // async remove(@Param('id') id: string) {
    //     return this.transactionService.remove(id);
    // }
}
