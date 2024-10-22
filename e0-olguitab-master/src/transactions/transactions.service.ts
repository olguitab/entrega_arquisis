import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transactions.schema';
import { Bet } from 'bets/bet.schema';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    ) {}

    // Crear una transacción
    async create(transactionData: Partial<Transaction>): Promise<Transaction> {
        const newTransaction = new this.transactionModel(transactionData);
        console.log("Creating a transaction");
        console.log(newTransaction);
        return newTransaction.save();
    }

    // Obtener todas las transacciones
    async findAll(): Promise<Transaction[]> {
        return this.transactionModel
            .find()
            .populate('betId')  // Carga el bet si existe
            .populate('walletId')   // Carga el wallet si existe
            .exec();
    }

    // Obtener una transacción por ID
    async findOne(id: string): Promise<Transaction> {
        const transaction = await this.transactionModel
            .findOne({ id })
            .populate('betId')  // Carga el request si existe
            .populate('walletId')   // Carga el wallet si existe
            .exec();
    
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }

    // Actualizar una transacción
    async update(id: string, updateData: Partial<Transaction>): Promise<Transaction> {
        const updatedTransaction = await this.transactionModel
            .findOneAndUpdate({ id }, updateData, { new: true })
            .populate('requestId')  // Carga el request si existe
            .populate('walletId')   // Carga el wallet si existe
            .exec();
    
        if (!updatedTransaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
        return updatedTransaction;
    }

    // Eliminar una transacción
    async remove(id: string): Promise<void> {
        const result = await this.transactionModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
    }

    async checkBetCreation(bet: Bet): Promise<void> {
    
        const { wallet, quantity, status, deposit_token, request_id } = bet;

        if (!wallet){

            // TO DO: llamar al metodo create del mismo servicio en vez de manejarlo dentro de la funcion
            const newTransaction = new this.transactionModel({
                token: deposit_token,
                amount: 1000 * quantity,           
                status: status,   
                betId: request_id
            });
            console.log(`Creating a transaction associated to the betId ${request_id}`);
        
            await newTransaction.save();
        }
    }
}