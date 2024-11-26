import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'user/user.service'; // Asegúrate de importar tu UsersService

@Injectable()       
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    if (user) {
      //const payload = { email: user.email, sub: user.userId };
      // añadir role client/admin
      const payload = { email: user.email, sub: user._id, role: user.role };
      return {
        ...user,
        accessToken: this.jwtService.sign(payload),
      };
    }
    return null;
  }
}