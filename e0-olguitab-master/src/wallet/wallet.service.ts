import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'user/user.schema';
import { Wallet } from './wallet.schema';
import { NotFoundException } from '@nestjs/common';

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
    console.log(`Wallet creada para el usuario: ${user_id}`);
  }

  /*


  async addMoneyToWallet(user_id: Types.ObjectId, amount: number): Promise<void> {
    await this.walletModel.updateOne({ user_id }, { $inc: { money: amount } });
  }
  */


  async addMoneyToWallet(user_id: string, amount: number): Promise<void> {
    console.log(`entra a add ${amount} money to wallet id: ${user_id}`);
  
    // Convierte el user_id de string a ObjectId
    const userObjectId = new Types.ObjectId(user_id);
  
    const wallet = await this.walletModel.findOneAndUpdate(
      { user_id: userObjectId }, // Usar el ObjectId aquí
      { $inc: { money: amount } }, // Asegúrate de usar 'money' en lugar de 'balance'
      { new: true, upsert: true } // 'new' devuelve el documento actualizado
    );
  
    if (!wallet) {
      throw new Error('Wallet not found');
    }
  
    console.log(`Money added to wallet: ${wallet}`);
  }
  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ user_id: userId }).exec();
  }
  
  async updateMoney(walletId: string, newMoneyValue: number): Promise<Wallet> {
    const wallet = await this.walletModel.findById(walletId).exec();
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    wallet.money = newMoneyValue; // Actualiza el valor del dinero
    return wallet.save(); // Guarda el wallet actualizado en la base de datos
  }
  async getWalletBalance(user_id: string): Promise<number> {
    console.log('entra a get wallet balance id:', user_id);
    
    // Convertir user_id a ObjectId
    const objectId = new Types.ObjectId(user_id);
    
    const wallet = await this.walletModel.findOne({ user_id: objectId });
    console.log('Wallet found:', wallet);
    
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    
    return wallet.money;
  }

  async findAll(): Promise<Wallet[]> {
    console.log('entra al get findAll wallets');
    return await this.walletModel.find().exec();
  }
}