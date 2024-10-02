import { Model, Types } from 'mongoose';
import { User } from 'user/user.schema';
import { Wallet } from './wallet.schema';
export declare class WalletService {
    private userModel;
    private walletModel;
    constructor(userModel: Model<User>, walletModel: Model<Wallet>);
    createWalletForExistingUsers(): Promise<void>;
    createWallet(user_id: Types.ObjectId): Promise<void>;
    addMoneyToWallet(user_id: Types.ObjectId, amount: number): Promise<void>;
    getWalletBalance(user_id: string): Promise<number>;
}
