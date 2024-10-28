import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyArray, Model } from 'mongoose';
import { Transaction } from './transactions.schema';
import { Bet } from 'bets/bet.schema';
import { WebpayService } from 'webpay/webpay.service';
import { MqttService } from '../mqtt/mqtt.service';


@Injectable()
export class TransactionService {
    constructor(
        private readonly webpayService: WebpayService,
        private readonly mqttService: MqttService,
        @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    ) {}

    async create(transactionData: Partial<Transaction>): Promise<any> {

        const walletId = transactionData.walletId;
        const betId = transactionData.betId;
        const sessionId = walletId || betId;
        const returnUrl = `http://localhost:4000/successful-purchase`;
        const amount = transactionData.amount;

        const response = await this.webpayService.createTransaction(amount, sessionId, returnUrl);

        const url = response.url;
        const token = response.token;

        const transactionDetails = {
            token: token,
            amount: amount,
            status: "PENDING",
            betId: betId,
            walletId: walletId,
        };

        const newTransaction = new this.transactionModel(transactionDetails);
        const savedTransaction = await newTransaction.save();
        console.log("Creating a transaction");

        return { url, savedTransaction };
    }

    async commitTransaction(token_ws: string, transactionId: string): Promise<string> {
        console.log('transactionId:', transactionId)
        const transaction = await this.transactionModel.findById(transactionId);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        try {
            const response = await this.webpayService.commitTransaction(token_ws);
            if (response.status) {
                transaction.status = response.status; 
                transaction.token = token_ws;
                const valid = response.status === "AUTHORIZED";
                
                const message = {
                    request_id: transaction.betId,
                    group_id: '23',
                    seller: 0,
                    valid: valid,
                };
                
                
                await this.mqttService.publishToMqttValidation(JSON.stringify(message));

                await transaction.save();
            } else {
                console.log('Error on WebPay response');
            }
        } catch (error) {
            console.log('Could not commit with WebPay:', error);
        }

        return transaction.status;
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionModel
            .find()
            .populate('betId')
            .populate('walletId')
            .exec();
    }

    async findOne(id: string): Promise<Transaction> {
        const transaction = await this.transactionModel
            .findOne({ id })
            .populate('betId')  
            .populate('walletId') 
            .exec();
    
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }

    async update(id: string, updateData: Partial<Transaction>): Promise<Transaction> {
        const updatedTransaction = await this.transactionModel
            .findOneAndUpdate({ id }, updateData, { new: true })
            .populate('requestId') 
            .populate('walletId')
            .exec();
    
        if (!updatedTransaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
        return updatedTransaction;
    }

    async remove(id: string): Promise<void> {
        const result = await this.transactionModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
    }

    async checkBetCreation(bet: Bet): Promise<void> {
    
        const { wallet, quantity, status, deposit_token, request_id } = bet;

        if (!wallet){

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