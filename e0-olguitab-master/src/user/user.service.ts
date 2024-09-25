import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema'; // Verifica que la ruta sea correcta
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    // Guardar el usuario en la base de datos
    await createdUser.save();
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
  // Puedes agregar más métodos para consultar, actualizar o eliminar usuarios
}