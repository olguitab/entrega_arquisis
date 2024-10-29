import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { WebpayService } from './webpay.service';

@Controller('webpay')
export class WebpayController {
    constructor(private readonly webpayService: WebpayService) {}

    @Post('pay')
    async initiatePayment(@Res() res, @Body() body: any) {
        const { amount, sessionId } = body;
        const returnUrl = `http://localhost:8000`;
        
        const response = await this.webpayService.createTransaction(amount, sessionId, returnUrl);
        
        return res.json({ url: response.url, token: response.token });
    }

    @Get('return')
    async handleReturn(@Query('token_ws') token: string) {
        const result = await this.webpayService.commitTransaction(token);

        if (result.status === 'AUTHORIZED') {
        // Aquí puedes enviar el mensaje a fixtures/validation o manejar el éxito
        return { message: 'Pago exitoso', result };
        } else {
        return { message: 'Pago fallido', result };
        }
    }
}
