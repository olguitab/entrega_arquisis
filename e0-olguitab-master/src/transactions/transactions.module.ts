import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transactions.schema';
import { Request, RequestSchema } from '../requests/requests.schema'; // Asegúrate de importar el esquema Request

@Module({
    imports: [
        MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema },
        { name: Request.name, schema: RequestSchema },
        ]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
