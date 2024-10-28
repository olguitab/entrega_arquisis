import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyArray, Model } from 'mongoose';
import { Transaction } from './transactions.schema';
import { Bet } from 'bets/bet.schema';
import { WebpayService } from 'webpay/webpay.service';

@Injectable()
export class TransactionService {
    constructor(
        private readonly webpayService: WebpayService,
        @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    ) {}

    // Crear una transacción
    async create(transactionData: Partial<Transaction>): Promise<any> {
        // primero crear la transaccion de webpay
        // como sessionId puedo usar la walletid o la betid, debo verificar cual de las dos existe y usar esa
        // obtengo el token y el url
        // creo la transaction con los parametros que recibe la funcion + los obtenidos por webpay

        const walletId = transactionData.walletId;
        const betId = transactionData.betId;

        // Parametros para la transaccion de webpay
        const sessionId = walletId || betId;
        // este url es a donde nos redireccionará webpay una vez que se haya realizado la transacción
        // debemos crearlo todavia, puede ser una página de transaccion exitosa y el resultado
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
        console.log(newTransaction);

        return { url, savedTransaction };
    }

    async commitTransaction(token_ws: string, transactionId: string): Promise<Transaction> {
        // 1. Buscar la transacción por ID
        console.log('transactionId:', transactionId)
        const transaction = await this.transactionModel.findById(transactionId);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // 2. Hacer la llamada al servicio de WebPay para el commit
        try {
            const response = await this.webpayService.commitTransaction(token_ws);
            console.log("response desde transactin service:", response);

            // 3. Verificar la respuesta y actualizar el estado y el token
            if (response.data && response.data.token) {
                transaction.status = response.data.status; // Asegúrate de que el campo existe
                transaction.token = response.data.token; // Actualiza el token si es necesario
                await transaction.save(); // Guardar los cambios en la base de datos
            } else {
                console.log('Error on WebPay response');
            }
        } catch (error) {
            console.log('Could not commit with WebPay:', error);
        }

        return transaction;
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