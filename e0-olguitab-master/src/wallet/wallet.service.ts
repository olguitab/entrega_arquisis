import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'user/user.schema';
import { Wallet } from './wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  // no sé si sea buena idea llamar a esta función, después significaría hacer la consulta
  // por cada usuario cada vez que se abra la app (o quizás no, y si es solo una vez en el deploy podría ser)
  // quizás mejor solo crear nuevos usuarios que contengan wallet por rapidez
  async createWalletForExistingUsers(): Promise<void> {
    const users = await this.userModel.find();

    for (const user of users) {
      // ver si tiene wallet
      const existingWallet = await this.walletModel.findOne({ user_id: user._id });
      if (!existingWallet) {
        await this.createWallet(user._id as Types.ObjectId);
        //console.log(`Wallet creada para el usuario: ${user._id}`);
      }
    }
  }

  async createWallet(user_id: Types.ObjectId): Promise<void> {
    await this.walletModel.create({
      user_id,
      money: 0,
    });
  }

  async addMoneyToWallet(user_id: Types.ObjectId, amount: number): Promise<void> {
    await this.walletModel.updateOne({ user_id }, { $inc: { money: amount } });
  }

  async getWalletBalance(user_id: string): Promise<number> {
    const wallet = await this.walletModel.findOne({ user_id });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet.money;
  }
}
