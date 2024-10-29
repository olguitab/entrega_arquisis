import { Injectable } from '@nestjs/common';
import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk'; // ES6 Modules
import Transaction from 'transbank-sdk/dist/es5/transbank/webpay/webpay_plus/transaction';


@Injectable()
export class WebpayService {

    private webpay;

    constructor() {
        this.webpay = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    }

    async createTransaction(amount: number, sessionId: string, returnUrl: string) {
        try {
        const buyOrder = 'Order_' + Math.floor(Math.random() * 10000);  // Generar una orden aleatoria
        
        const response = await this.webpay.create(buyOrder, sessionId, amount, returnUrl);
        console.log(`Getting return url and transaction token...`);
        return response;
        } catch (error) {
        console.error('Error creando transacción:', error);
        throw new Error('Error al crear la transacción');
        //localhost:4000/bets/ID/confirmed
        }
    }

    async commitTransaction(token: string) {
        try {
        const response = await this.webpay.commit(token);
        return response;
        } catch (error) {
        console.error('Error confirmando transacción:', error);
        throw new Error('Error al confirmar la transacción');
        }
    }
}
