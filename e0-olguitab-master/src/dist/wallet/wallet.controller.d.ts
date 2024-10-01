import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    addMoney(requestBody: any): Promise<void>;
    getBalance(user_id: string): Promise<number>;
}
