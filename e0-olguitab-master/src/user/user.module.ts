import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema'; // Ajusta las rutas según tu estructura
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AuthModule } from 'auth/auth.module';
import { WalletModule } from 'wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    WalletModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // Exporta el servicio si necesitas usarlo fuera de este módulo
})
export class UsersModule {}