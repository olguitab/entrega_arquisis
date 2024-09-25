// src/auth/auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
    imports: [
        forwardRef(() => UsersModule),
      PassportModule,
      JwtModule.register({
        secret: 'secretKey', // Asegúrate de usar una clave segura y almacenarla en un lugar seguro
        signOptions: { expiresIn: '60s' }, // Configura según tus necesidades
      }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}