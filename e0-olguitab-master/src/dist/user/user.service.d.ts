import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import { WalletService } from 'wallet/wallet.service';
export declare class UsersService {
    private userModel;
    private walletService;
    constructor(userModel: Model<UserDocument>, walletService: WalletService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    validateUser(email: string, pass: string): Promise<any>;
    findUserByEmail(email: string): Promise<UserDocument | null>;
    findAll(): Promise<User[]>;
}
