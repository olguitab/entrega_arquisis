import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema'; // Verifica que la ruta sea correcta
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './create-user.dto';
import { WalletService } from 'wallet/wallet.service';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private walletService: WalletService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    // Guardar el usuario en la base de datos
    await createdUser.save();
    // función crear wallet
    await this.walletService.createWallet(createdUser._id as Types.ObjectId);
    return createdUser.toObject(); // Asegúrate de devolver el objeto después de guardarlo
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject(); // Aquí usamos toObject() correctamente
      return result;
    }
    return null;
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    // Ajusta el tipo de retorno para reflejar que devuelve un documento de Mongoose
    return this.userModel.findOne({ email }).exec();
  }
    // Función para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  async createAdmin(): Promise<User> {
    // Busca si ya existe un admin
    const existingAdmin = await this.userModel.findOne({ role: UserRole.Admin });
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }
  
    const hashedPassword = await bcrypt.hash('admin23', 10); 
    const admin = new this.userModel({
      username: 'admin',
      email: 'admin@uc.cl',
      password: hashedPassword,
      role: UserRole.Admin,
    });
    await admin.save();
    console.log('Admin user created successfully');
    await this.walletService.createWallet(admin._id as Types.ObjectId);
    await this.walletService.updateWalletBalance(admin._id as string, 1000000);
    
    return admin.toObject();
  }

  async deleteAdminBets(): Promise<any> {
    const adminId = await this.getAdminId();
    // función para borrar los admin bets que salieron con mal seller
  }

  async getAdminId(): Promise<any> {
    const admin = await this.userModel.findOne({ role: UserRole.Admin });
    if (!admin) {
      throw new Error('Admin not found');
    }
    console.log('Admin ID:', admin._id);
    return admin._id;
  }
  
}