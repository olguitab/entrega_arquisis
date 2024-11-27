// src/auth/auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

import { RolesGuard } from './guards/roles.guards';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [
        forwardRef(() => UsersModule),
      PassportModule,
      JwtModule.register({
        secret: 'secretKey', // cambiar por JWT_SECRET del .env
        signOptions: { expiresIn: '24h' }, 
      }),
    ],
    providers: [AuthService, JwtStrategy, RolesGuard, AuthGuard],
    exports: [AuthService, RolesGuard, AuthGuard],
  })
  export class AuthModule {}