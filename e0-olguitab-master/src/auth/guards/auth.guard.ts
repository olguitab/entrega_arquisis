import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Obtener token
    if (!token) return false;

    try {
      const decoded = this.jwtService.verify(token); // Decodificar el token
      request.user = decoded; // Añadir info del usuario a la petición
      return true;
    } catch (error) {
      return false;
    }
  }
}
